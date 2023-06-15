import type { Output } from '@core/wallet/types'
import type { IStorageDepositReturnUnlockCondition } from '@iota/types'
import { OUTPUT_TYPE_NFT, UNLOCK_CONDITION_STORAGE_DEPOSIT_RETURN } from '../../../constants'

export function getStorageDepositFromOutput(
    output: Output,
    rawAmount?: string
): {
    storageDeposit: number
    giftedStorageDeposit: number
} {
    const storageDepositReturnUnlockCondition = <IStorageDepositReturnUnlockCondition>(
        output?.unlockConditions?.find(
            (unlockCondition) => unlockCondition?.type === UNLOCK_CONDITION_STORAGE_DEPOSIT_RETURN
        )
    )
    if (storageDepositReturnUnlockCondition) {
        return { storageDeposit: Number(storageDepositReturnUnlockCondition.amount), giftedStorageDeposit: 0 }
    } else if (output.type === OUTPUT_TYPE_NFT || (output?.nativeTokens?.length > 0 && Number(output?.amount) > 0)) {
        return { storageDeposit: 0, giftedStorageDeposit: Number(output?.amount) }
    } else if (rawAmount && Number(rawAmount) > 0 && Number(output?.amount) > Number(rawAmount)) {
        return { storageDeposit: 0, giftedStorageDeposit: Number(output?.amount) - Number(rawAmount) }
    } else {
        return { storageDeposit: 0, giftedStorageDeposit: 0 }
    }
}
