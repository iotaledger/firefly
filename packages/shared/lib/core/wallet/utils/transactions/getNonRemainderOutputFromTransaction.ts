import { getRecipientAddressFromOutput } from '../'
import { Transaction } from '@iota/wallet'
import { OutputTypes } from '@iota/types'

export function getNonRemainderOutputFromTransaction(
    transaction: Transaction,
    accountAddress: string
): { output: OutputTypes; outputIndex: number } {
    const outputs = transaction.payload.essence.outputs
    const nonRemainerOutputIndex = outputs.findIndex((output) => {
        const recipientAddress = getRecipientAddressFromOutput(output)

        if (transaction.incoming) {
            return accountAddress === recipientAddress
        } else {
            return accountAddress !== recipientAddress
        }
    })
    return { output: outputs[nonRemainerOutputIndex], outputIndex: nonRemainerOutputIndex }
}
