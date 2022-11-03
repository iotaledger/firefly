import { ASYNC_UNLOCK_CONDITION_TYPES } from '../../constants'
import { Output } from '@core/wallet/types'

export function isOutputAsync(output: Output): boolean {
    for (const unlockCondition of output.unlockConditions) {
        if (ASYNC_UNLOCK_CONDITION_TYPES.some((type) => type === unlockCondition.type)) {
            return true
        }
    }
}
