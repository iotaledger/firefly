import { BasicOutput, InclusionState, NftOutput } from '@iota/sdk/out/types'
import { ActivityAction, ActivityDirection, ActivityType } from '../../enums'
import {
    ActivityGenerationParameters,
    IWalletState,
    ProcessedTransaction,
} from '../../interfaces'
import {
    activityOutputContainsValue,
    getAmountFromOutput,
    getAsyncDataFromOutput,
    getLayer2ActivityInformation,
    getMetadataFromOutput,
    getNativeTokenFromOutput,
    getNftId,
    getNonRemainderBasicOutputsFromTransaction,
    getStorageDepositFromOutput,
    getTagFromOutput,
} from '../../utils'
import { ActivityBase, ActivityBaseOptions, SpecialStatus } from './base-activity.type'
import { isShimmerClaimingTransaction } from '@contexts/onboarding'
import { activeProfileId, getCoinType } from '@core/profile'
import { get } from 'svelte/store'
import { ActivityNft } from './nft-activity.type'
import { addOrUpdateNftInAllWalletNfts, buildNftFromNftOutput } from '@core/nfts'
import { ActivityConsolidation } from './consolidation-activity.type'
import { localize } from '@core/i18n'

interface ActivityTransactionOptions extends ActivityBaseOptions {
    rawAmount: number
    assetId: string
    isShimmerClaiming: boolean
}

export class ActivityTransaction extends ActivityBase {
    constructor(private basicOptions: ActivityTransactionOptions) {
        super(basicOptions)
    }

    assetId(){
        return this.basicOptions.assetId
    }

    type(){
        return ActivityType.Transaction
    }

    subjectLocale(): string {
        if (this.isShimmerClaiming()) {
            return localize('general.shimmerGenesis')
        } else {
            return super.subjectLocale()
        }
    }

    isShimmerClaiming(){
        return this.basicOptions.isShimmerClaiming
    }

    tileTitle(): string {
        const isConfirmed = this.inclusionState() === InclusionState.Confirmed
        if (this.isShimmerClaiming()) {
            return isConfirmed ? 'general.shimmerClaimed' : 'general.shimmerClaiming'
        } else {
            return super.tileTitle()
        }
    }

    static async fromOutputs(
        processedTransaction: ProcessedTransaction,
        wallet: IWalletState
    ): Promise<ActivityBase[]> {
        const activities = []

        const basicOutputs = getNonRemainderBasicOutputsFromTransaction(
            processedTransaction.outputs,
            wallet.depositAddress,
            processedTransaction.direction
        )
        const burnedNftInputs = processedTransaction.getBurnedNftInputs()
        for (const basicOutput of basicOutputs) {
            let activity: ActivityBase

            const isSelfTransaction = processedTransaction.direction === ActivityDirection.SelfTransaction
            const burnedNftInputIndex = burnedNftInputs.findIndex(
                (input) => input.output.amount === basicOutput.output.amount
            )
            const burnedNativeToken = burnedNftInputIndex < 0 ? processedTransaction.getBurnedNativeTokens() : undefined

            // NFT Activity
            if (isSelfTransaction && burnedNftInputIndex >= 0) {
                const wrappedInput = burnedNftInputs[burnedNftInputIndex]
                const nftInput = wrappedInput.output as NftOutput

                activity = await ActivityNft.fromProcessedTransaction(
                    wallet,
                    {
                        action: ActivityAction.Burn,
                        processedTransaction,
                        wrappedOutput: basicOutput,
                    },
                    getNftId(nftInput.nftId, wrappedInput.outputId)
                )
                const nft = buildNftFromNftOutput(wrappedInput, wallet.depositAddress, false)
                addOrUpdateNftInAllWalletNfts(wallet.id, nft)

                burnedNftInputs.splice(burnedNftInputIndex, 1)
            }
            // Burn Activity
            else if (isSelfTransaction && burnedNativeToken) {
                activity = await ActivityTransaction.fromProcessedTransaction(wallet, {
                    action: ActivityAction.Burn,
                    processedTransaction,
                    wrappedOutput: basicOutput,
                })
            }
            // Consolidation Activity
            else if (isSelfTransaction && ActivityBase.isConsolidation(basicOutput, processedTransaction)) {
                activity = await ActivityConsolidation.fromProcessedTransaction(wallet, {
                    action: ActivityAction.Send,
                    processedTransaction,
                    wrappedOutput: basicOutput,
                })
            }
            // Send Activity
            else {
                activity = await ActivityTransaction.fromProcessedTransaction(wallet, {
                    action: ActivityAction.Send,
                    processedTransaction,
                    wrappedOutput: basicOutput,
                })
            }
            activities.push(activity)
        }
        return activities
    }

    static async fromProcessedTransaction(
        wallet: IWalletState,
        { action, processedTransaction, wrappedOutput }: ActivityGenerationParameters,
        fallbackAssetId?: string,
        fallbackAmount?: number
    ): Promise<ActivityTransaction> {
        const { transactionId, direction, claimingData, time, inclusionState } = processedTransaction

        const specialStatus = SpecialStatus.Unclaimed // TODO: Fix this
        const isHidden = false
        const isAssetHidden = false
        const outputId = wrappedOutput.outputId
        const id = outputId || transactionId
        const output = wrappedOutput.output as BasicOutput
        const containsValue = await activityOutputContainsValue(wallet, wrappedOutput)
        const amount = getAmountFromOutput(output)
        const isShimmerClaiming = isShimmerClaimingTransaction(transactionId, get(activeProfileId))
        const tag = getTagFromOutput(output)
        const metadata = getMetadataFromOutput(output)
        const sendingInfo = processedTransaction.getSendingInformation(wallet, output)
        const asyncData = await getAsyncDataFromOutput(output, outputId, claimingData, wallet)
        const { parsedLayer2Metadata, destinationNetwork } = getLayer2ActivityInformation(metadata, sendingInfo)
        const layer2Allowance = Number(parsedLayer2Metadata?.baseTokens ?? '0')
        const gasBudget = Number(parsedLayer2Metadata?.gasBudget ?? '0')
        const gasFee = layer2Allowance > 0 ? amount - layer2Allowance : 0

        let { storageDeposit, giftedStorageDeposit } = await getStorageDepositFromOutput(output)
        giftedStorageDeposit = action === ActivityAction.Burn ? 0 : giftedStorageDeposit
        giftedStorageDeposit = gasBudget === 0 ? giftedStorageDeposit : 0

        const baseTokenAmount = amount - storageDeposit - gasFee
        const nativeToken = getNativeTokenFromOutput(output)
        const assetId = fallbackAssetId ?? nativeToken?.id ?? getCoinType()

        let surplus: number | undefined = undefined
        if (nativeToken) {
            const storageDepositToDeduct = (storageDeposit > 0 ? storageDeposit : giftedStorageDeposit) ?? 0
            surplus = Number(output.amount) - storageDepositToDeduct
        }

        let rawAmount: number
        if (fallbackAmount === undefined) {
            rawAmount = nativeToken ? Number(nativeToken?.amount) : baseTokenAmount
        } else {
            rawAmount = fallbackAmount
        }

        // Note: we update the displayed storage deposit so it matches what was displayed in the send confirmation flow
        // set the storage deposit to zero if the amount is greater than the storage deposit
        // to improve the UX so the user doesnt think they need to pay the storage deposit
        if (!nativeToken && !storageDeposit && rawAmount >= giftedStorageDeposit) {
            storageDeposit = giftedStorageDeposit = 0
        }

        return new ActivityTransaction({
            isHidden,
            id,
            inclusionState,
            specialStatus,
            time,
            transactionId,
            direction,
            action,
            isAssetHidden,
            containsValue,
            outputId,
            storageDeposit,
            giftedStorageDeposit,
            surplus,
            isShimmerClaiming,
            metadata,
            tag,
            asyncData,
            destinationNetwork,
            parsedLayer2Metadata,
            isInternal: sendingInfo.isInternal,
            subject: sendingInfo.subject,
            rawAmount,
            assetId
        })
    }
}
