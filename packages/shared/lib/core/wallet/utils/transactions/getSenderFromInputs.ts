import { Subject } from '../../types'
import { ADDRESS_TYPE_ED25519, OUTPUT_TYPE_TREASURY, UNLOCK_CONDITION_ADDRESS } from '../../constants'
import { convertEd25519ToBech32 } from '../convertEd25519ToBech32'
import { getSubjectFromAddress } from '../getSubjectFromAddress'
import { IOutputResponse } from '@iota/types'

export function getSenderFromInputs(inputs: IOutputResponse[]): Subject {
    for (const input of inputs) {
        if (input.output.type !== OUTPUT_TYPE_TREASURY) {
            for (const unlockCondition of input.output.unlockConditions) {
                if (
                    unlockCondition.type === UNLOCK_CONDITION_ADDRESS &&
                    unlockCondition.address.type === ADDRESS_TYPE_ED25519
                ) {
                    return getSubjectFromAddress(convertEd25519ToBech32(unlockCondition.address.pubKeyHash))
                }
            }
        }
    }
    return undefined
}
