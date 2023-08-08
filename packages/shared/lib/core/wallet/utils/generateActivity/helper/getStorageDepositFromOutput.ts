import { IAccountState } from '@core/account/interfaces'
import { getClient } from '@core/profile-manager/api/getClient'
import { CommonOutput, StorageDepositReturnUnlockCondition, UnlockConditionType } from '@iota/wallet/out/types'

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
        output?.unlockConditions?.find(
            (unlockCondition) => unlockCondition?.type === UnlockConditionType.StorageDepositReturn
        )
    )
    if (storageDepositReturnUnlockCondition) {
        return { storageDeposit: Number(storageDepositReturnUnlockCondition.amount), giftedStorageDeposit: 0 }
    } else {
        const client = await getClient()
        const minimumRequiredStorageDeposit = await client.minimumRequiredStorageDeposit(output)
        let minimumRequiredStorageDepositNumber = Number(minimumRequiredStorageDeposit)
        minimumRequiredStorageDepositNumber =
            minimumRequiredStorageDepositNumber > 0 ? minimumRequiredStorageDepositNumber : 0
        return {
            storageDeposit: 0,
            giftedStorageDeposit: minimumRequiredStorageDepositNumber,
        }
    }
}
