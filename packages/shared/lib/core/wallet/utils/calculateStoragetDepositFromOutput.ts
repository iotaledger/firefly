import type { OutputTypes } from '@iota/types'
import { OUTPUT_TYPE_TREASURY, UNLOCK_CONDITION_STORAGE_DEPOSIT_RETURN } from '../constants'

export function calculateStorageDepositFromOutput(output: OutputTypes, rawAmount: number): number {
    if (output.type !== OUTPUT_TYPE_TREASURY) {
        const storageDepositUnlockCondition = output?.unlockConditions?.find(
            (unlockCondition) => unlockCondition?.type === UNLOCK_CONDITION_STORAGE_DEPOSIT_RETURN
        )
        const amount =
            storageDepositUnlockCondition?.type === UNLOCK_CONDITION_STORAGE_DEPOSIT_RETURN
                ? Number(storageDepositUnlockCondition.amount)
                : Number(output.amount) - rawAmount
        return amount
    }
}
