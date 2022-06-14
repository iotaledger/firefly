import { UnlockConditionTypes } from '@iota/types'
import { ADDRESS_TYPE_ED25519, UNLOCK_CONDITION_STORAGE_DEPOSIT_RETURN } from '../constants'
import { ed25519ToBech32 } from './ed25519ToBech32'

export function getSenderAddressFromUnlockCondition(unlockCondition: UnlockConditionTypes): string {
    if (
        unlockCondition.type === UNLOCK_CONDITION_STORAGE_DEPOSIT_RETURN &&
        unlockCondition.returnAddress.type === ADDRESS_TYPE_ED25519
    ) {
        return ed25519ToBech32(unlockCondition.returnAddress.pubKeyHash)
    }
    return undefined
}
