import {
    ActivityAction,
    ActivityGenerationParameters,
    ActivityType,
    EMPTY_HEX_ID,
    IWalletState,
    ProcessedTransaction,
    getAsyncDataFromOutput,
    getClient,
    getLayer2ActivityInformation,
    getMetadataFromOutput,
    getNftId,
    getStorageDepositFromOutput,
    getTagFromOutput,
} from '@core/wallet'
import { ActivityBase, ActivityBaseOptions, BaseActivity, SpecialStatus } from './base-activity.type'
import { NftOutput, OutputType } from '@iota/sdk/out/types'
import { handleError } from '@core/error/handlers'

export type NftActivity = BaseActivity & {
    type: ActivityType.Nft
    nftId: string
}

interface ActivityNftOptions extends ActivityBaseOptions {
    nftId: string
}

export class ActivityNft extends ActivityBase {
    constructor(private nftOptions: ActivityNftOptions) {
        super(nftOptions)
    }

    nftId(): string {
        return this.nftOptions.nftId
    }

    static async fromOutputs(
        processedTransaction: ProcessedTransaction,
        wallet: IWalletState
    ): Promise<ActivityBase[]> {
        const outputs = processedTransaction.outputs
        const activities = []

        const nftOutputs = outputs.filter((output) => output.output.type === OutputType.Nft)
        for (const nftOutput of nftOutputs) {
            const output = nftOutput.output as NftOutput
            const activity = await ActivityNft.fromProcessedTransaction(wallet, {
                action: output.nftId === EMPTY_HEX_ID ? ActivityAction.Mint : ActivityAction.Send,
                processedTransaction,
                wrappedOutput: nftOutput,
            })
            activities.push(activity)
        }
        return activities
    }

    static async fromProcessedTransaction(
        wallet: IWalletState,
        { action, processedTransaction, wrappedOutput }: ActivityGenerationParameters,
        nftIdFromInput?: string
    ): Promise<ActivityNft> {
        const { claimingData, time, inclusionState, transactionId, direction } = processedTransaction
        const outputId = wrappedOutput.outputId
        const output = wrappedOutput.output as NftOutput
        const id = outputId || transactionId

        const isHidden = false
        const isAssetHidden = false
        const containsValue = true
        const specialStatus = SpecialStatus.Unclaimed // TODO: Fix this

        const nftId = nftIdFromInput ? nftIdFromInput : getNftId(output.nftId, outputId)
        const metadata = getMetadataFromOutput(output)
        const tag = getTagFromOutput(output)

        const sendingInfo = processedTransaction.getSendingInformation(wallet, output)
        const { subject, isInternal } = sendingInfo

        const { parsedLayer2Metadata, destinationNetwork } = getLayer2ActivityInformation(metadata, sendingInfo)
        const gasBudget = Number(parsedLayer2Metadata?.gasBudget ?? '0')

        const storageDepositData = await getStorageDepositFromOutput(output)
        const { storageDeposit } = storageDepositData
        let { giftedStorageDeposit } = storageDepositData
        giftedStorageDeposit = action === ActivityAction.Burn ? 0 : giftedStorageDeposit
        giftedStorageDeposit = gasBudget === 0 ? giftedStorageDeposit : 0

        let surplus: number | undefined = undefined
        try {
            const client = await getClient()
            const minimumRequiredStorageDeposit = await client.computeMinimumOutputAmount(output)
            surplus = Number(output.amount) - Number(minimumRequiredStorageDeposit)
            if (surplus && !storageDeposit) {
                giftedStorageDeposit = Number(minimumRequiredStorageDeposit)
            }
        } catch (err) {
            handleError(err)
        }

        const asyncData = await getAsyncDataFromOutput(output, outputId, claimingData, wallet)

        return new ActivityNft({
            specialStatus,
            id,
            transactionId,
            outputId,
            nftId,
            time,
            isHidden,
            action,
            giftedStorageDeposit,
            surplus,
            isAssetHidden,
            containsValue,
            inclusionState,
            storageDeposit,
            metadata,
            tag,
            asyncData,
            subject,
            isInternal,
            direction,
            destinationNetwork,
            parsedLayer2Metadata,
        })
    }
}
