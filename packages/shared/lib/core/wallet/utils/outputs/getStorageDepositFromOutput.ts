import { OutputTypes } from '@iota/types'
import { OUTPUT_TYPE_TREASURY, UNLOCK_CONDITION_STORAGE_DEPOSIT_RETURN } from '../../constants'

export function getStorageDepositFromOutput(output: OutputTypes): {
    storageDeposit: number
    giftedStorageDeposit: number
} {
    if (output && output?.type !== OUTPUT_TYPE_TREASURY) {
        for (const unlockCondition of output.unlockConditions) {
            if (unlockCondition?.type === UNLOCK_CONDITION_STORAGE_DEPOSIT_RETURN) {
                return { storageDeposit: Number(unlockCondition.amount), giftedStorageDeposit: 0 }
            }
        }
        if (output?.nativeTokens?.length > 0 && Number(output?.amount) > 0) {
            return { storageDeposit: 0, giftedStorageDeposit: Number(output?.amount) }
        } else {
            return { storageDeposit: 0, giftedStorageDeposit: 0 }
        }
    } else {
        return { storageDeposit: 0, giftedStorageDeposit: 0 }
    }
}
