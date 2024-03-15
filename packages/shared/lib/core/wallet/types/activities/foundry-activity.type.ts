import { ActivityAction, ActivityType } from '@core/wallet/enums'
import { ActivityBase, ActivityBaseOptions, BaseActivity, SpecialStatus } from './base-activity.type'
import { ActivityGenerationParameters, IWalletState, ProcessedTransaction } from '../../interfaces'
import { AccountAddress, FoundryOutput, ImmutableAccountAddressUnlockCondition, OutputType, SimpleTokenScheme, UnlockConditionType } from '@iota/sdk/out/types'
import { getAmountFromOutput, getAsyncDataFromOutput, getMetadataFromOutput, getNativeTokenFromOutput, getTagFromOutput } from '../../utils'
import { api } from 'shared/lib/core/api'
import { getCoinType, getNetworkHrp } from 'shared/lib/core/profile'

export type FoundryActivity = BaseActivity & {
    type: ActivityType.Foundry
    rawAmount: number
    assetId: string
    accountAddress: string
    mintedTokens: string
    meltedTokens: string
    maximumSupply: string
}

interface ActivityFoundryOptions extends ActivityBaseOptions {
    rawAmount: number
    assetId: string
    accountAddress: string
    mintedTokens: string
    meltedTokens: string
    maximumSupply: string
}

export class ActivityFoundry extends ActivityBase {
    constructor(private foundryOptions: ActivityFoundryOptions) {
        super(foundryOptions)
    }

    static async fromOutputs(
        processedTransaction: ProcessedTransaction,
        wallet: IWalletState
    ): Promise<ActivityBase[]> {
        const outputs = processedTransaction.outputs
        const activities = []

        const foundryOutputs = outputs.filter((output) => output.output.type === OutputType.Foundry)
        for (const foundryOutput of foundryOutputs) {
            activities.push(
                await ActivityFoundry.fromProcessedTransaction(wallet, {
                    action: ActivityAction.Mint,
                    processedTransaction,
                    wrappedOutput: foundryOutput,
                })
            )
        }
        return activities
    }

    static async fromProcessedTransaction(
        wallet: IWalletState,
        { action, processedTransaction, wrappedOutput }: ActivityGenerationParameters
    ) {
        const { transactionId, claimingData, time, direction, inclusionState } = processedTransaction

        const specialStatus = SpecialStatus.Unclaimed // TODO: Fix this
        const output = wrappedOutput.output as FoundryOutput
        const outputId = wrappedOutput.outputId
        const tokenScheme = output.tokenScheme as SimpleTokenScheme
        const mintedTokens = tokenScheme.mintedTokens.toString()
        const meltedTokens = tokenScheme.meltedTokens.toString()
        const maximumSupply = tokenScheme.maximumSupply.toString()

        const addressUnlockCondition = output.unlockConditions.find(
            (unlockCondition) => unlockCondition.type === UnlockConditionType.ImmutableAccountAddress
        ) as ImmutableAccountAddressUnlockCondition
        const accountId = (addressUnlockCondition?.address as AccountAddress)?.accountId
        // TODO: Research whether this address should be optional or not.
        const accountAddress = accountId ? api.accountIdToBech32(accountId, getNetworkHrp()) : undefined

        const isHidden = false
        const isAssetHidden = false
        const containsValue = true

        const id = outputId || transactionId
        const nativeToken = getNativeTokenFromOutput(output)
        const assetId = nativeToken?.id ?? getCoinType()

        const storageDeposit = getAmountFromOutput(output)
        const giftedStorageDeposit = 0
        const rawAmount = Number(nativeToken?.amount ?? 0)
        const metadata = getMetadataFromOutput(output)
        const tag = getTagFromOutput(output)

        const sendingInfo = processedTransaction.getSendingInformation(wallet, output)
        const asyncData = await getAsyncDataFromOutput(output, outputId, claimingData, wallet)
        return new ActivityFoundry({
            specialStatus,
            isHidden,
            id,
            outputId,
            transactionId,
            direction,
            action,
            assetId,
            accountAddress,
            mintedTokens,
            meltedTokens,
            maximumSupply,
            storageDeposit,
            giftedStorageDeposit,
            rawAmount,
            time,
            inclusionState,
            containsValue,
            isAssetHidden,
            metadata,
            tag,
            asyncData,
            ...sendingInfo,
        })
    }
}
