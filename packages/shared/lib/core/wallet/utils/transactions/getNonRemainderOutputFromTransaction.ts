import { getRecipientAddressFromOutput } from '../'
import { Transaction } from '@iota/wallet'
import { OutputTypes } from '@iota/types'

export function getNonRemainderOutputFromTransaction(
    transaction: Transaction,
    accountAddress: string
): { output: OutputTypes; outputIndex: number; isSelfTransaction: boolean } {
    const outputs = transaction.payload.essence.outputs

    const nonRemainerOutputIndex = outputs.findIndex((output) => {
        const recipientAddress = getRecipientAddressFromOutput(output)

        if (transaction.incoming) {
            return accountAddress === recipientAddress
        } else {
            return accountAddress !== recipientAddress
        }
    })
    if (nonRemainerOutputIndex >= 0) {
        return {
            output: outputs[nonRemainerOutputIndex],
            outputIndex: nonRemainerOutputIndex,
            isSelfTransaction: false,
        }
    } else {
        if (outputs.every((output) => accountAddress === getRecipientAddressFromOutput(output))) {
            const outputIndex = outputs.findIndex((output) => accountAddress === getRecipientAddressFromOutput(output))

            return { output: outputs[outputIndex], outputIndex: outputIndex, isSelfTransaction: true }
        }
    }
}
