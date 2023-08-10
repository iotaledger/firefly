import {
    AddressType,
    Ed25519Address,
    ExpirationUnlockCondition,
    StorageDepositReturnUnlockCondition,
    UnlockConditionType,
} from '@iota/sdk/out/types'
import { getBech32AddressFromAddressTypes } from './getBech32AddressFromAddressTypes'

export function getSenderAddressFromUnlockCondition(
    unlockCondition: StorageDepositReturnUnlockCondition | ExpirationUnlockCondition
): string | undefined {
    if (
        (unlockCondition?.type === UnlockConditionType.StorageDepositReturn ||
            unlockCondition?.type === UnlockConditionType.Expiration) &&
        unlockCondition?.returnAddress?.type === AddressType.Ed25519
    ) {
        return getBech32AddressFromAddressTypes(
            new Ed25519Address((unlockCondition.returnAddress as Ed25519Address).pubKeyHash)
        )
    } else {
        return undefined
    }
}
