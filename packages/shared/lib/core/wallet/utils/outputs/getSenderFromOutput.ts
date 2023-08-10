import { Subject } from '../../types'
import { getBech32AddressFromAddressTypes } from '../getBech32AddressFromAddressTypes'
import { UNLOCK_CONDITION_EXPIRATION, UNLOCK_CONDITION_STORAGE_DEPOSIT_RETURN } from '@core/wallet/constants'
import { getSubjectFromAddress } from '../getSubjectFromAddress'
import { CommonOutput, ExpirationUnlockCondition, StorageDepositReturnUnlockCondition } from '@iota/sdk'

export function getSenderFromOutput(output: CommonOutput): Subject | undefined {
    for (const unlockCondition of output.unlockConditions) {
        if (
            unlockCondition?.type === UNLOCK_CONDITION_STORAGE_DEPOSIT_RETURN ||
            unlockCondition?.type === UNLOCK_CONDITION_EXPIRATION
        ) {
            const storageOrExpirationUnlockCondition = unlockCondition as
                | StorageDepositReturnUnlockCondition
                | ExpirationUnlockCondition
            const address = getBech32AddressFromAddressTypes(storageOrExpirationUnlockCondition?.returnAddress)
            if (address) {
                return getSubjectFromAddress(address)
            }
        }
    }
}
