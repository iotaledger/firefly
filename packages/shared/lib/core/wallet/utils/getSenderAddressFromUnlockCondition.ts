import { UnlockConditionTypes } from '@iota/types'
import { ADDRESS_TYPE_ED25519, UNLOCK_CONDITION_STORAGE_DEPOSIT_RETURN } from '../constants'
import { convertEd25519ToBech32 } from './convertEd25519ToBech32'

export function getSenderAddressFromUnlockCondition(unlockCondition: UnlockConditionTypes): string {
    if (
        unlockCondition.type === UNLOCK_CONDITION_STORAGE_DEPOSIT_RETURN &&
        unlockCondition.returnAddress.type === ADDRESS_TYPE_ED25519
    ) {
        return convertEd25519ToBech32(unlockCondition.returnAddress.pubKeyHash)
    }
    return undefined
}
