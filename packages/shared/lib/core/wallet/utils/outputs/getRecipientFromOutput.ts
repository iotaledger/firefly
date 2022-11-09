import { getRecipientAddressFromOutput } from './getRecipientAddressFromOutput'
import { Output, Subject } from '../../types'
import { getSubjectFromAddress } from '../getSubjectFromAddress'

export function getRecipientFromOutput(output: Output): Subject {
    const recipientAddress = getRecipientAddressFromOutput(output)
    return getSubjectFromAddress(recipientAddress)
}
