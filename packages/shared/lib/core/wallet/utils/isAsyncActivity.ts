import { UnlockConditionTypes } from '@iota/types'
import { OutputData } from '@iota/wallet'
import { ASYNC_UNLOCK_CONDITION_TYPES } from '../constants'

export function isAsyncActivity(output: OutputData): boolean {
    return output.output.unlockConditions.some((unlockCondition) => isAsyncUnlockCondition(unlockCondition))
}

export function isAsyncUnlockCondition(unlockCondition: UnlockConditionTypes): boolean {
    return ASYNC_UNLOCK_CONDITION_TYPES.includes(unlockCondition.type)
}
