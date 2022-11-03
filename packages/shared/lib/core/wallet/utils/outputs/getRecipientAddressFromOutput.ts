import { Output } from '@core/wallet/types'
import { UNLOCK_CONDITION_ADDRESS } from '../../constants'
import { getBech32AddressFromAddressTypes } from '../getBech32AddressFromAddressTypes'

export function getRecipientAddressFromOutput(output: Output): string {
    for (const unlockCondition of output.unlockConditions) {
        if (unlockCondition.type === UNLOCK_CONDITION_ADDRESS) {
            return getBech32AddressFromAddressTypes(unlockCondition.address)
        }
    }
}
