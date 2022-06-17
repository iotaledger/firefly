import { OutputTypes } from '@iota/types'
import { ADDRESS_TYPE_ED25519, OUTPUT_TYPE_BASIC, UNLOCK_CONDITION_ADDRESS } from '../../constants'
import { convertEd25519ToBech32 } from '../convertEd25519ToBech32'

export function getRecipientAddressFromOutput(output: OutputTypes): string {
    if (output && output.type === OUTPUT_TYPE_BASIC) {
        for (const unlockCondition of output.unlockConditions) {
            if (
                unlockCondition.type === UNLOCK_CONDITION_ADDRESS &&
                unlockCondition.address.type === ADDRESS_TYPE_ED25519
            ) {
                return convertEd25519ToBech32(unlockCondition.address.pubKeyHash)
            }
        }
    } else {
        return undefined
    }
}
