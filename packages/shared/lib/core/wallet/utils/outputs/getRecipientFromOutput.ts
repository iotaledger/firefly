import { getRecipientAddressFromOutput } from './getRecipientAddressFromOutput'
import { OutputTypes } from '@iota/types'
import { Recipient } from '../../types'
import { getAccoutByAddress } from '../getAccoutByAddress'

export function getRecipientFromOutput(output: OutputTypes): Recipient {
    const recipientAddress = getRecipientAddressFromOutput(output)
    return getAccoutByAddress(recipientAddress)
}
