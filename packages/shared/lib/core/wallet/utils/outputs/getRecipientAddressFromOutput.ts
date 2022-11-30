import { UNLOCK_CONDITION_ADDRESS } from '../../constants'
import { Output } from '../../types'
import { getBech32AddressFromAddressTypes } from '../getBech32AddressFromAddressTypes'

export function getRecipientAddressFromOutput(output: Output): string {
    for (const unlockCondition of output.unlockConditions) {
        if (unlockCondition.type === UNLOCK_CONDITION_ADDRESS) {
            return getBech32AddressFromAddressTypes(unlockCondition.address)
        }
    }
}
