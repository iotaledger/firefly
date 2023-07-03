import { IAccountState } from '@core/account/interfaces'
import { Output } from '@core/wallet/types'
import { IStorageDepositReturnUnlockCondition } from '@iota/types'
import { UNLOCK_CONDITION_STORAGE_DEPOSIT_RETURN } from '../../../constants'

export async function getStorageDepositFromOutput(
    account: IAccountState,
    output: Output
): Promise<{
    storageDeposit: number
    giftedStorageDeposit: number
}> {
    if (!(account?.index >= 0)) {
        return { storageDeposit: 0, giftedStorageDeposit: 0 }
    }
    const storageDepositReturnUnlockCondition = <IStorageDepositReturnUnlockCondition>(
        output?.unlockConditions?.find(
            (unlockCondition) => unlockCondition?.type === UNLOCK_CONDITION_STORAGE_DEPOSIT_RETURN
        )
    )
    if (storageDepositReturnUnlockCondition) {
        return { storageDeposit: Number(storageDepositReturnUnlockCondition.amount), giftedStorageDeposit: 0 }
    } else {
        const minimumRequiredStorageDeposit = await account.minimumRequiredStorageDeposit(output)
        let minimumRequiredStorageDepositNumber = Number(minimumRequiredStorageDeposit)
        minimumRequiredStorageDepositNumber =
            minimumRequiredStorageDepositNumber > 0 ? minimumRequiredStorageDepositNumber : 0
        return {
            storageDeposit: 0,
            giftedStorageDeposit: (minimumRequiredStorageDepositNumber =
                minimumRequiredStorageDepositNumber > 0 ? minimumRequiredStorageDepositNumber : 0),
        }
    }
}
