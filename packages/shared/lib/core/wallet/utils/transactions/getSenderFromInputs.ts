import { Subject } from '../../types'
import { ADDRESS_TYPE_ED25519, UNLOCK_CONDITION_ADDRESS } from '../../constants'
import { convertEd25519ToBech32 } from '../convertEd25519ToBech32'
import { getSubjectFromAddress } from '../getSubjectFromAddress'

export function getSenderFromInputs(inputs: unknown[]): Subject {
    for (const input of inputs) {
        for (const unlockCondition of input.output.unlockConditions) {
            if (
                unlockCondition.type === UNLOCK_CONDITION_ADDRESS &&
                unlockCondition.address.type === ADDRESS_TYPE_ED25519
            ) {
                return getSubjectFromAddress(convertEd25519ToBech32(unlockCondition.address.pubKeyHash))
            }
        }
    }
    return undefined
}
