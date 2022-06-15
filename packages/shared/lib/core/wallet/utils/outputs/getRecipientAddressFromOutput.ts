import { OutputTypes } from '@iota/types'
import { ADDRESS_TYPE_ED25519, OUTPUT_TYPE_BASIC, UNLOCK_CONDITION_ADDRESS } from '../../constants'
import { ed25519ToBech32 } from '../ed25519ToBech32'

export function getRecipientAddressFromOutput(output: OutputTypes): string {
    if (output.type === OUTPUT_TYPE_BASIC) {
        for (const unlockCondition of output.unlockConditions) {
            if (
                unlockCondition.type === UNLOCK_CONDITION_ADDRESS &&
                unlockCondition.address.type === ADDRESS_TYPE_ED25519
            ) {
                return ed25519ToBech32(unlockCondition.address.pubKeyHash)
            }
        }
    }
    return undefined
}
