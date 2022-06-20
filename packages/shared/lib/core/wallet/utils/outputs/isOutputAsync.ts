import { ASYNC_UNLOCK_CONDITION_TYPES, OUTPUT_TYPE_TREASURY } from '../../constants'
import { OutputTypes } from '@iota/types'

export function isOutputAsync(output: OutputTypes): boolean {
    if (output && output?.type !== OUTPUT_TYPE_TREASURY) {
        for (const unlockCondition of output.unlockConditions) {
            if (ASYNC_UNLOCK_CONDITION_TYPES.some((type) => type === unlockCondition.type)) {
                return true
            }
        }
    }
    return false
}
