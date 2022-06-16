import { OutputTypes } from '@iota/types'
import { OUTPUT_TYPE_TREASURY } from '../../constants'
import { Sender } from '../../types'
import { getAccoutByAddress } from '../getAccoutByAddress'
import { getSenderAddressFromUnlockCondition } from '../getSenderAddressFromUnlockCondition'

export function getSenderFromOutput(output: OutputTypes): Sender {
    if (output.type !== OUTPUT_TYPE_TREASURY) {
        for (const unlockCondition of output.unlockConditions) {
            const senderAddress = getSenderAddressFromUnlockCondition(unlockCondition)
            if (senderAddress) {
                return getAccoutByAddress(senderAddress)
            }
        }
    } else {
        return undefined
    }
}
