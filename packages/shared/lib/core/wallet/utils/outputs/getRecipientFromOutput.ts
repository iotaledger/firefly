import { getRecipientAddressFromOutput } from './getRecipientAddressFromOutput'
import { OutputTypes } from '@iota/types'
import { Subject } from '../../types'
import { getSubjectFromAddress } from '../getSubjectFromAddress'

export function getRecipientFromOutput(output: OutputTypes): Subject {
    const recipientAddress = getRecipientAddressFromOutput(output)
    return getSubjectFromAddress(recipientAddress)
}
