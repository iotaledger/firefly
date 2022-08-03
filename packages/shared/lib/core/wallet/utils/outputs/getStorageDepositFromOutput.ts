import { OutputTypes } from '@iota/types'
import { OUTPUT_TYPE_TREASURY, UNLOCK_CONDITION_STORAGE_DEPOSIT_RETURN } from '../../constants'

export function getStorageDepositFromOutput(output: OutputTypes): [number, number] {
    if (output && output?.type !== OUTPUT_TYPE_TREASURY) {
        for (const unlockCondition of output.unlockConditions) {
            if (unlockCondition?.type === UNLOCK_CONDITION_STORAGE_DEPOSIT_RETURN) {
                return [Number(unlockCondition.amount), 0]
            }
        }
        if (output?.nativeTokens?.length > 0 && Number(output?.amount) > 0) {
            return [0, Number(output?.amount)]
        } else {
            return [0, 0]
        }
    } else {
        return [0, 0]
    }
}
