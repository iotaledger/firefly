import {
    IBasicOutput,
    IAliasOutput,
    IFoundryOutput,
    INftOutput,
    IStorageDepositReturnUnlockCondition,
} from '@iota/types'
import { UNLOCK_CONDITION_STORAGE_DEPOSIT_RETURN } from '../../../constants'

export function getStorageDepositFromOutput(output: IBasicOutput | IAliasOutput | IFoundryOutput | INftOutput): {
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
    } else if (output?.nativeTokens?.length > 0 && Number(output?.amount) > 0) {
        return { storageDeposit: 0, giftedStorageDeposit: Number(output?.amount) }
    } else {
        return { storageDeposit: 0, giftedStorageDeposit: 0 }
    }
}
