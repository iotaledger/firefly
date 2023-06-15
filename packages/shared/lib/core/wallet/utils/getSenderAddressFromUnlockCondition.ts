import type { IExpirationUnlockCondition, IStorageDepositReturnUnlockCondition } from '@iota/types'
import {
    ADDRESS_TYPE_ED25519,
    UNLOCK_CONDITION_EXPIRATION,
    UNLOCK_CONDITION_STORAGE_DEPOSIT_RETURN,
} from '../constants'
import { getBech32AddressFromAddressTypes } from './getBech32AddressFromAddressTypes'

export function getSenderAddressFromUnlockCondition(
    unlockCondition: IStorageDepositReturnUnlockCondition | IExpirationUnlockCondition
): string {
    if (
        (unlockCondition?.type === UNLOCK_CONDITION_STORAGE_DEPOSIT_RETURN ||
            unlockCondition?.type === UNLOCK_CONDITION_EXPIRATION) &&
        unlockCondition?.returnAddress?.type === ADDRESS_TYPE_ED25519
    ) {
        return getBech32AddressFromAddressTypes(unlockCondition?.returnAddress)
    } else {
        return undefined
    }
}
