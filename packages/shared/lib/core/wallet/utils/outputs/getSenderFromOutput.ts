import { Subject } from '../../types'
import { getBech32AddressFromAddressTypes } from '../getBech32AddressFromAddressTypes'
import { getSubjectFromAddress } from '../getSubjectFromAddress'
import {
    CommonOutput,
    ExpirationUnlockCondition,
    StorageDepositReturnUnlockCondition,
    UnlockConditionType,
} from '@iota/sdk/out/types'

export function getSenderFromOutput(output: CommonOutput): Subject | undefined {
    for (const unlockCondition of output.unlockConditions) {
        if (
            unlockCondition?.type === UnlockConditionType.StorageDepositReturn ||
            unlockCondition?.type === UnlockConditionType.Expiration
        ) {
            const storageOrExpirationUnlockCondition = unlockCondition as
                | StorageDepositReturnUnlockCondition
                | ExpirationUnlockCondition
            const address = getBech32AddressFromAddressTypes(storageOrExpirationUnlockCondition.returnAddress)
            if (address) {
                return getSubjectFromAddress(address)
            }
        }
    }
}
