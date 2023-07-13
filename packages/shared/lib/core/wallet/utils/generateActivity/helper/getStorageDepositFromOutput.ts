import { IAccountState } from '@core/account/interfaces'
import { CommonOutput, StorageDepositReturnUnlockCondition, UnlockConditionType } from '@iota/wallet'

export async function getStorageDepositFromOutput(
    account: IAccountState,
    output: CommonOutput
): Promise<{
    storageDeposit: number
    giftedStorageDeposit: number
}> {
    if (!(account?.index >= 0)) {
        return { storageDeposit: 0, giftedStorageDeposit: 0 }
    }
    const storageDepositReturnUnlockCondition = <StorageDepositReturnUnlockCondition>(
        output
            ?.getUnlockConditions()
            ?.find((unlockCondition) => unlockCondition?.getType() === UnlockConditionType.StorageDepositReturn)
    )
    if (storageDepositReturnUnlockCondition) {
        return { storageDeposit: Number(storageDepositReturnUnlockCondition.getAmount()), giftedStorageDeposit: 0 }
    } else {
        const minimumRequiredStorageDeposit = await account.minimumRequiredStorageDeposit(output)
        let minimumRequiredStorageDepositNumber = Number(minimumRequiredStorageDeposit)
        minimumRequiredStorageDepositNumber =
            minimumRequiredStorageDepositNumber > 0 ? minimumRequiredStorageDepositNumber : 0
        return {
            storageDeposit: 0,
            giftedStorageDeposit: minimumRequiredStorageDepositNumber,
        }
    }
}
