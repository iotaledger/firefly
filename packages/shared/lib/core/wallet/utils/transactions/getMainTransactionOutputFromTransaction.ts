import { getRecipientAddressFromOutput } from '..'
import { OutputTypes } from '@iota/types'

export function getMainTransactionOutputFromTransaction(
    outputs: OutputTypes[],
    accountAddress: string,
    isIncoming: boolean
): { output: OutputTypes; outputIndex: number; isSelfTransaction: boolean } {
    const nonRemainerOutputIndex = outputs.findIndex((output) => {
        const recipientAddress = getRecipientAddressFromOutput(output)

        if (isIncoming) {
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
    return { output: undefined, outputIndex: undefined, isSelfTransaction: undefined }
}
