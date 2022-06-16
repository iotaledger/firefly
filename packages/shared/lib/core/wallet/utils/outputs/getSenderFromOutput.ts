import { OutputTypes } from '@iota/types'
import { findAccountWithAddress } from '@lib/wallet'
import { OUTPUT_TYPE_TREASURY } from '../../constants'
import { Sender } from '../../types'
import { getSenderAddressFromUnlockCondition } from '../getSenderAddressFromUnlockCondition'

export function getSenderFromOutput(output: OutputTypes): Sender {
    if (output.type !== OUTPUT_TYPE_TREASURY) {
        for (const unlockCondition of output.unlockConditions) {
            const senderAddress = getSenderAddressFromUnlockCondition(unlockCondition)
            const senderAccount = findAccountWithAddress(senderAddress)

            if (senderAccount) {
                return { type: 'account', account: senderAccount }
            } else if (senderAddress) {
                return { type: 'address', address: senderAddress }
            }
        }
    } else {
        return undefined
    }
}
