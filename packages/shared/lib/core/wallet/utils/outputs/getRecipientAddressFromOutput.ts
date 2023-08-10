import { AddressUnlockCondition, CommonOutput } from '@iota/sdk/out/types'
import { UNLOCK_CONDITION_ADDRESS } from '../../constants'
import { getBech32AddressFromAddressTypes } from '../getBech32AddressFromAddressTypes'

export function getRecipientAddressFromOutput(output: CommonOutput): string | undefined {
    for (const unlockCondition of output.unlockConditions) {
        if (unlockCondition.type === UNLOCK_CONDITION_ADDRESS) {
            const addressUnlockCondition = unlockCondition as AddressUnlockCondition
            return getBech32AddressFromAddressTypes(addressUnlockCondition.address)
        }
    }
}
