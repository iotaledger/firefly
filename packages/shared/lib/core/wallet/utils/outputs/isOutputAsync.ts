import { CommonOutput, Output, OutputType } from '@iota/wallet'
import { ASYNC_UNLOCK_CONDITION_TYPES } from '../../constants'

export function isOutputAsync(output: Output): boolean {
    if (output.type === OutputType.Treasury) {
        return false
    }

    for (const unlockCondition of (output as CommonOutput).getUnlockConditions()) {
        if (ASYNC_UNLOCK_CONDITION_TYPES.some((type) => type === unlockCondition.type)) {
            return true
        }
    }

    return false
}
