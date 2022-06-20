import { OutputTypes } from '@iota/types'
import { OUTPUT_TYPE_TREASURY, UNLOCK_CONDITION_STORAGE_DEPOSIT_RETURN } from '../../constants'

export function getStorageDepositFromOutput(output: OutputTypes): number {
    if (output?.type !== OUTPUT_TYPE_TREASURY) {
        for (const unlockCondition of output.unlockConditions) {
            if (unlockCondition?.type === UNLOCK_CONDITION_STORAGE_DEPOSIT_RETURN) {
                return Number(unlockCondition.amount)
            }
        }
    }
    return 0
}
