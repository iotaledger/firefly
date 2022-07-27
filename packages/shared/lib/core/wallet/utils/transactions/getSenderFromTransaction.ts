import { Subject } from '@core/wallet/types'
import { ITransactionPayload, OutputTypes } from '@iota/types'
import { getSubjectFromAddress } from '../getSubjectFromAddress'
import { getRecipientAddressFromOutput, getSenderFromOutput } from '../outputs'

export function getSenderFromTransaction(
    isIncoming: boolean,
    accountAddress: string,
    output: OutputTypes,
    transaction: ITransactionPayload
): Subject {
    if (isIncoming) {
        if (transaction) {
            const remainderOutput = transaction.essence.outputs.find(
                (output) => accountAddress !== getRecipientAddressFromOutput(output)
            )
            const address = getRecipientAddressFromOutput(remainderOutput)
            return address ? getSubjectFromAddress(address) : getSenderFromOutput(output)
        } else {
            return getSenderFromOutput(output)
        }
    } else {
        return { type: 'address', address: accountAddress }
    }
}
