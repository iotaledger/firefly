import { getRecipientAddressFromOutput } from './getRecipientAddressFromOutput'
import { Subject } from '../../types'
import { getSubjectFromAddress } from '../getSubjectFromAddress'
import { CommonOutput } from '@iota/sdk/out/types'

export function getRecipientFromOutput(output: CommonOutput): Subject | undefined {
    const recipientAddress = getRecipientAddressFromOutput(output)
    if (recipientAddress) {
        return getSubjectFromAddress(recipientAddress)
    }
}
