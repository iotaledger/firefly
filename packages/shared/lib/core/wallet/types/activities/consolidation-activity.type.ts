import { ActivityType } from '@core/wallet/enums'
import { ActivityBase, ActivityBaseOptions, BaseActivity, SpecialStatus } from './base-activity.type'
import { ActivityGenerationParameters, IActivityGenerationParameters, IWalletState, IWrappedOutput } from '../../interfaces'
import { BasicOutput, InclusionState, OutputType } from '@iota/sdk/out/types'
import { activityOutputContainsValue, getAsyncDataFromOutput, getMetadataFromOutput, getSendingInformation, getStorageDepositFromOutput, getTagFromOutput } from '../../utils'

export type ConsolidationActivity = BaseActivity & {
    type: ActivityType.Consolidation
    amountConsolidatedInputs: number
}

interface ActivityConsolidationOptions extends ActivityBaseOptions {
    amountConsolidatedInputs: number
}

export class ActivityConsolidation extends ActivityBase {
    constructor(private consolidationOptions: ActivityConsolidationOptions) {
        super(consolidationOptions)
    }

    amountConsolidatedInputs(): number {
        return this.consolidationOptions.amountConsolidatedInputs
    }

    tileTitle(): string {
        const isConfirmed = this.inclusionState() === InclusionState.Confirmed
        return isConfirmed ? 'general.consolidated' : 'general.consolidating'
    }

    static async fromProcessedTransaction(
        wallet: IWalletState,
        { action, processedTransaction, wrappedOutput }: ActivityGenerationParameters
    ) {
        const { transactionId, direction, claimingData, time, inclusionState, wrappedInputs } = processedTransaction

        const specialStatus = SpecialStatus.Unclaimed // TODO: Fix this
        const isHidden = false
        const isAssetHidden = false
        const containsValue = await activityOutputContainsValue(wallet, wrappedOutput)

        const outputId = wrappedOutput.outputId
        const id = outputId || transactionId

        const output = wrappedOutput.output as BasicOutput

        const amountConsolidatedInputs = getAmountOfConsolidationInputs(wrappedInputs)

        const tag = getTagFromOutput(output)
        const metadata = getMetadataFromOutput(output)

        const sendingInfo = getSendingInformation(processedTransaction, output, wallet)
        const asyncData = await getAsyncDataFromOutput(output, outputId, claimingData, wallet)

        const { storageDeposit, giftedStorageDeposit } = await getStorageDepositFromOutput(output)
        return new ActivityConsolidation({
            specialStatus,
            isHidden,
            id,
            transactionId,
            time,
            direction,
            action,
            isAssetHidden,
            inclusionState,
            containsValue,
            outputId,
            storageDeposit,
            giftedStorageDeposit,
            metadata,
            tag,
            asyncData,
            amountConsolidatedInputs,
            ...sendingInfo,
        })
    }
}

function getAmountOfConsolidationInputs(inputs: IWrappedOutput[]): number {
    return inputs.filter((input) => input.output.type === OutputType.Basic).length
}