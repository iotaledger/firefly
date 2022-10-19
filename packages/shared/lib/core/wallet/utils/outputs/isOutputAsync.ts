import { ASYNC_UNLOCK_CONDITION_TYPES } from '../../constants'
import { ICommonOutput } from '@iota/types'

export function isOutputAsync(output: ICommonOutput): boolean {
    for (const unlockCondition of output.unlockConditions) {
        if (ASYNC_UNLOCK_CONDITION_TYPES.some((type) => type === unlockCondition.type)) {
            return true
        }
    }
}
