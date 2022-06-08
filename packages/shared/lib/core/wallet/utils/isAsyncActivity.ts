import { UnlockConditionTypes } from '@iota/types'
import { OutputData } from '@iota/wallet'

export function isAsyncActivity(output: OutputData): boolean {
    return output.output.unlockConditions.some((unlockCondition) => isAsyncUnlockCondition(unlockCondition))
}

export function isAsyncUnlockCondition(unlockCondition: UnlockConditionTypes): boolean {
    // StorageDepositReturn or ExpirationTime
    const asyncUnlockConditionTypes = [1, 3]

    return asyncUnlockConditionTypes.includes(unlockCondition.type)
}
