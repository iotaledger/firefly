import { OutputTypes, IStorageDepositReturnUnlockCondition } from '@iota/types'
import { OUTPUT_TYPE_TREASURY, UNLOCK_CONDITION_STORAGE_DEPOSIT_RETURN } from '../../constants'

export function getStorageDepositFromOutput(output: OutputTypes): {
    storageDeposit: number
    giftedStorageDeposit: number
} {
    if (output && output.type !== OUTPUT_TYPE_TREASURY) {
        const storageDepositReturnUnlockCondition = <IStorageDepositReturnUnlockCondition>(
            output.unlockConditions?.find(
                (unlockCondition) => unlockCondition?.type === UNLOCK_CONDITION_STORAGE_DEPOSIT_RETURN
            )
        )
        if (storageDepositReturnUnlockCondition) {
            return { storageDeposit: Number(storageDepositReturnUnlockCondition.amount), giftedStorageDeposit: 0 }
        } else if (output.nativeTokens?.length > 0 && Number(output.amount) > 0) {
            return { storageDeposit: 0, giftedStorageDeposit: Number(output.amount) }
        } else {
            return { storageDeposit: 0, giftedStorageDeposit: 0 }
        }
    } else {
        return { storageDeposit: 0, giftedStorageDeposit: 0 }
    }
}
