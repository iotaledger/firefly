import { ActivityAction, ActivityType } from '@core/wallet/enums'
import { ActivityBase, ActivityBaseOptions, BaseActivity, SpecialStatus } from './base-activity.type'
import {
    ActivityGenerationParameters,
    IWalletState,
    ProcessedTransaction,
} from '../../interfaces'
import { AnchorOutput, OutputType } from '@iota/sdk/out/types'
import { EMPTY_HEX_ID } from '../../constants'
import { getAmountFromOutput, getAsyncDataFromOutput, getGovernorAddressFromAnchorOutput, getMetadataFromOutput, getStateControllerAddressFromAnchorOutput, getStorageDepositFromOutput, getTagFromOutput } from '../../utils'

export type AnchorActivity = BaseActivity & {
    type: ActivityType.Anchor
    governorAddress: string
    stateControllerAddress: string
}

interface ActivityAnchorOptions extends ActivityBaseOptions {
    governorAddress: string
    stateControllerAddress: string
}

export class ActivityAnchor extends ActivityBase {
    constructor(private anchorOptions: ActivityAnchorOptions) {
        super(anchorOptions)
    }

    governorAddress(): string {
        return this.anchorOptions.governorAddress
    }

    stateControllerAddress(): string {
        return this.anchorOptions.stateControllerAddress
    }

    static async fromOutputs(
        processedTransaction: ProcessedTransaction,
        wallet: IWalletState
    ): Promise<ActivityBase[]> {
        const outputs = processedTransaction.outputs
        const activities = []

        const anchorOutputs = outputs.filter((output) => output.output.type === OutputType.Anchor)
        for (const anchorOutput of anchorOutputs) {
            const output = anchorOutput.output as AnchorOutput
            const activity = await ActivityAnchor.fromProcessedTransaction(wallet, {
                action: output.anchorId === EMPTY_HEX_ID ? ActivityAction.Mint : ActivityAction.Send,
                processedTransaction,
                wrappedOutput: anchorOutput,
            })
            activities.push(activity)
        }
        return activities
    }

    static async fromProcessedTransaction(
        wallet: IWalletState,
        { action, processedTransaction, wrappedOutput }: ActivityGenerationParameters
    ): Promise<ActivityAnchor> {
        const { transactionId, claimingData, direction, time, inclusionState } = processedTransaction

        const specialStatus = SpecialStatus.Unclaimed // TODO: Fix this
        const output = wrappedOutput.output as AnchorOutput
        const outputId = wrappedOutput.outputId
        const id = outputId || transactionId

        const { storageDeposit: _storageDeposit, giftedStorageDeposit } = await getStorageDepositFromOutput(
            output
        )
        const storageDeposit = getAmountFromOutput(output) + _storageDeposit
        const governorAddress = getGovernorAddressFromAnchorOutput(output)
        const stateControllerAddress = getStateControllerAddressFromAnchorOutput(output)

        const isHidden = false
        const isAssetHidden = false
        const containsValue = true

        const metadata = getMetadataFromOutput(output)
        const tag = getTagFromOutput(output)
        const asyncData = await getAsyncDataFromOutput(output, outputId, claimingData, wallet)
        const sendingInfo = processedTransaction.getSendingInformation(wallet, output)

        return new ActivityAnchor({
            isHidden,
            id,
            inclusionState,
            specialStatus,
            time,
            transactionId,
            direction,
            action,
            governorAddress,
            stateControllerAddress,
            isAssetHidden,
            containsValue,
            outputId,
            storageDeposit,
            giftedStorageDeposit,
            metadata,
            tag,
            asyncData,
            ...sendingInfo,
        })
    }
}
