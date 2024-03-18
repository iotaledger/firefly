import { ActivityType } from '@core/wallet/enums'
import { ActivityBase, ActivityBaseOptions, BaseActivity, SpecialStatus } from './base-activity.type'
import { activityOutputContainsValue, getAmountFromOutput, getAsyncDataFromOutput, getLayer2ActivityInformation, getMetadataFromOutput, getStorageDepositFromOutput, getTagFromOutput } from '../../utils'
import { ActivityGenerationParameters, IWalletState } from '../../interfaces'
import { BasicOutput } from '@iota/sdk/out/types'
import { localize } from 'shared/lib/core/i18n'
import { getCoinType } from 'shared/lib/core/profile'

interface ActivityVestingOptions extends ActivityBaseOptions {
    rawAmount: number
    assetId: string
}

export class ActivityVesting extends ActivityBase {
    constructor(private vestingOptions: ActivityVestingOptions) {
        super(vestingOptions)
    }

    type(){
        return ActivityType.Vesting
    }

    assetId(){
        return this.vestingOptions.assetId
    }

    subjectLocale(): string {
        return localize('general.stardustGenesis')
    }

    tileTitle(): string {
        return 'general.vestingReward'
    }

    static async fromProcessedTransaction(
        wallet: IWalletState,
        { action, processedTransaction, wrappedOutput }: ActivityGenerationParameters
    ): Promise<ActivityVesting> {
        const { transactionId, direction, claimingData, time, inclusionState } = processedTransaction

        const specialStatus = SpecialStatus.Unclaimed // TODO: Fix this
        const isHidden = false
        const isAssetHidden = false
        const containsValue = await activityOutputContainsValue(wallet, wrappedOutput)

        const outputId = wrappedOutput.outputId
        const id = outputId || transactionId

        const output = wrappedOutput.output as BasicOutput

        const tag = getTagFromOutput(output)
        const metadata = getMetadataFromOutput(output)

        const sendingInfo = processedTransaction.getSendingInformation(wallet, output)
        const asyncData = await getAsyncDataFromOutput(output, outputId, claimingData, wallet)

        const { parsedLayer2Metadata, destinationNetwork } = getLayer2ActivityInformation(metadata, sendingInfo)

        const { storageDeposit, giftedStorageDeposit } = await getStorageDepositFromOutput(output)
        const rawAmount = getAmountFromOutput(output) - storageDeposit

        const assetId = getCoinType()

        return new ActivityVesting({
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
            assetId,
            storageDeposit,
            giftedStorageDeposit,
            rawAmount,
            metadata,
            tag,
            asyncData,
            destinationNetwork,
            ...sendingInfo,
            ...parsedLayer2Metadata,
        })
    }
}
