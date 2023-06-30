import { Output, Subject } from '../../types'
import { getBech32AddressFromAddressTypes } from '../getBech32AddressFromAddressTypes'
import { UNLOCK_CONDITION_EXPIRATION, UNLOCK_CONDITION_STORAGE_DEPOSIT_RETURN } from '@core/wallet/constants'
import { getSubjectFromAddress } from '../getSubjectFromAddress'

export function getSenderFromOutput(output: Output): Subject | undefined {
    for (const unlockCondition of output.unlockConditions) {
        if (
            unlockCondition?.type === UNLOCK_CONDITION_STORAGE_DEPOSIT_RETURN ||
            unlockCondition?.type === UNLOCK_CONDITION_EXPIRATION
        ) {
            return getSubjectFromAddress(getBech32AddressFromAddressTypes(unlockCondition?.returnAddress))
        }
    }
}
