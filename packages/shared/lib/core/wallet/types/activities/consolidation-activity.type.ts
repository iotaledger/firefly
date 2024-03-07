import { ActivityType } from '@core/wallet/enums'
import { ActivityBase, ActivityBaseOptions, BaseActivity, SpecialStatus } from './base-activity.type'
import { IActivityGenerationParameters, IWalletState } from '../../interfaces'

export type ConsolidationActivity = BaseActivity & {
    type: ActivityType.Consolidation
    amountConsolidatedInputs: number
}

interface ActivityConsolidationOptions extends ActivityBaseOptions {
    amountConsolidatedInputs: number
}

export class ActivityConsolidation extends ActivityBase {
    constructor(options: ActivityConsolidationOptions) {
        super(options)
    }

    static async fromProcessedTransaction(wallet: IWalletState,
        { action, processedTransaction, wrappedOutput }: IActivityGenerationParameters
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
            id,
            inclusionState,
            specialStatus,
            amountConsolidatedInputs,
            time,
            from,
            to
        })
    }
}
