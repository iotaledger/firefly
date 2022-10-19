import { getRecipientAddressFromOutput } from './getRecipientAddressFromOutput'
import { ICommonOutput } from '@iota/types'
import { Subject } from '../../types'
import { getSubjectFromAddress } from '../getSubjectFromAddress'

export function getRecipientFromOutput(output: ICommonOutput): Subject {
    const recipientAddress = getRecipientAddressFromOutput(output)
    return getSubjectFromAddress(recipientAddress)
}
