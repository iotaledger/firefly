import { findAccountWithAddress } from '@lib/wallet'
import { getRecipientAddressFromOutput } from './getRecipientAddressFromOutput'
import { OutputTypes } from '@iota/types'
import { Recipient } from '../../types'

export function getRecipientFromOutput(output: OutputTypes): Recipient {
    const recipientAddress = getRecipientAddressFromOutput(output)
    const recipientAccount = findAccountWithAddress(recipientAddress)
    if (recipientAccount) {
        return { type: 'account', account: recipientAccount }
    } else {
        return { type: 'address', address: recipientAddress }
    }
}
