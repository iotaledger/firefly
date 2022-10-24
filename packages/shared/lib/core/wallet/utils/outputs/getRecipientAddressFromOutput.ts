import { OutputTypes } from '@iota/types'
import { OUTPUT_TYPE_TREASURY, UNLOCK_CONDITION_ADDRESS } from '../../constants'
import { getBech32AddressFromAddressTypes } from '../getBech32AddressFromAddressTypes'

export function getRecipientAddressFromOutput(output: OutputTypes): string {
    if (output?.type !== OUTPUT_TYPE_TREASURY) {
        for (const unlockCondition of output.unlockConditions) {
            if (unlockCondition.type === UNLOCK_CONDITION_ADDRESS) {
                return getBech32AddressFromAddressTypes(unlockCondition.address)
            }
        }
    } else {
        return undefined
    }
}
