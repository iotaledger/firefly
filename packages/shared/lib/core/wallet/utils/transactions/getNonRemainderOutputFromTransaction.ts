import { getRecipientAddressFromOutput } from '../'
import { Transaction } from '@iota/wallet'
import { OutputTypes } from '@iota/types'

export function getNonRemainderOutputFromTransaction(transaction: Transaction, accountAddress: string): OutputTypes {
    const outputs = transaction.payload.essence.outputs
    const nonRemainerOutputs = outputs.filter((output) => {
        const recipientAddress = getRecipientAddressFromOutput(output)

        if (transaction.incoming) {
            return accountAddress === recipientAddress
        } else {
            return accountAddress !== recipientAddress
        }
    })
    return nonRemainerOutputs[0]
}
