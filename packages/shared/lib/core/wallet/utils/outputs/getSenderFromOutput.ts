import { OutputTypes } from '@iota/types'
import { OUTPUT_TYPE_TREASURY } from '../../constants'
import { Subject } from '../../types'
import { getSubjectFromAddress } from '../getSubjectFromAddress'
import { getSenderAddressFromUnlockCondition } from '../getSenderAddressFromUnlockCondition'

export function getSenderFromOutput(output: OutputTypes): Subject {
    if (output && output?.type !== OUTPUT_TYPE_TREASURY) {
        for (const unlockCondition of output.unlockConditions) {
            const senderAddress = getSenderAddressFromUnlockCondition(unlockCondition)
            if (senderAddress) {
                return getSubjectFromAddress(senderAddress)
            }
        }
    } else {
        return undefined
    }
}
