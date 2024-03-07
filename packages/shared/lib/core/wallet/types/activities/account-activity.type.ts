import { ActivityType } from '@core/wallet/enums'
import { ActivityBase, ActivityBaseOptions, BaseActivity, SpecialStatus } from './base-activity.type'
import { IActivityGenerationParameters, IWalletState } from '../../interfaces'

export type AccountActivity = BaseActivity & {
    type: ActivityType.Account
    accountAddress: string
    accountId: string
}


interface ActivityAccountOptions extends ActivityBaseOptions {
    accountAddress: string
    accountId: string
}

export class ActivityAccount extends ActivityBase {
    constructor(options: ActivityAccountOptions) {
        super(options)
    }

    static async fromProcessedTransaction(wallet: IWalletState,
        { action, processedTransaction, wrappedOutput }: IActivityGenerationParameters
    ) {
        const { transactionId, claimingData, direction, time, inclusionState } = processedTransaction

        const specialStatus = SpecialStatus.Unclaimed // TODO: Fix this
        const output = wrappedOutput.output as AccountOutput
        const outputId = wrappedOutput.outputId
        const id = outputId || transactionId
    
        const { storageDeposit: _storageDeposit, giftedStorageDeposit } = await getStorageDepositFromOutput(output)
        const storageDeposit = getAmountFromOutput(output) + _storageDeposit
        const accountId = getAccountId(output, outputId)
        const accountAddress = api.accountIdToBech32(accountId, getNetworkHrp())
    
        const isHidden = false
        const isAssetHidden = false
        const containsValue = true
    
        const metadata = getMetadataFromOutput(output)
        const tag = getTagFromOutput(output)
        const asyncData = await getAsyncDataFromOutput(output, outputId, claimingData, wallet)
        const sendingInfo = getSendingInformation(processedTransaction, output, wallet)

        return new ActivityAccount({
            id,
            inclusionState,
            specialStatus,
            accountAddress,
            accountId,
            time,
            from,
            to
        })
    }
}
