import {
    AddressType,
    Ed25519Address,
    ExpirationUnlockCondition,
    StorageDepositReturnUnlockCondition,
    UnlockConditionType,
} from '@iota/wallet/out/types'
import { getBech32AddressFromAddressTypes } from './getBech32AddressFromAddressTypes'

export function getSenderAddressFromUnlockCondition(
    unlockCondition: StorageDepositReturnUnlockCondition | ExpirationUnlockCondition
): string | undefined {
    if (
        (unlockCondition?.getType() === UnlockConditionType.StorageDepositReturn ||
            unlockCondition?.getType() === UnlockConditionType.Expiration) &&
        unlockCondition?.getReturnAddress()?.getType() === AddressType.Ed25519
    ) {
        return getBech32AddressFromAddressTypes(
            new Ed25519Address((unlockCondition.getReturnAddress() as Ed25519Address).getPubKeyHash())
        )
    } else {
        return undefined
    }
}
