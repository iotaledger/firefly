import { OutputTypes } from '@iota/types'
import { OUTPUT_TYPE_TREASURY } from '../../constants'
import { Sender } from '../../types'
import { getSenderAddressFromUnlockCondition } from '../getSenderAddressFromUnlockCondition'

export function getSenderFromOutput(output: OutputTypes): Sender {
    if (output.type !== OUTPUT_TYPE_TREASURY) {
        for (const unlockCondition of output.unlockConditions) {
            const senderAddress = getSenderAddressFromUnlockCondition(unlockCondition)
            if (senderAddress) {
                return {
                    type: 'address',
                    address: senderAddress,
                }
            }
        }
    } else {
        return undefined
    }
}
