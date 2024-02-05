import { CommonOutput, Output, UnlockConditionType } from '@iota/sdk/out/types'

const ASYNC_UNLOCK_CONDITION_TYPES = [
    UnlockConditionType.StorageDepositReturn,
    UnlockConditionType.Expiration,
    UnlockConditionType.Timelock,
]

export function isOutputAsync(output: Output): boolean {
    for (const unlockCondition of (output as CommonOutput).unlockConditions) {
        if (ASYNC_UNLOCK_CONDITION_TYPES.some((type) => type === unlockCondition.type)) {
            return true
        }
    }

    return false
}
