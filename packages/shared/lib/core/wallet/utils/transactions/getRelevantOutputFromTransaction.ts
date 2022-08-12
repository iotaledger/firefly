import { getRecipientAddressFromOutput } from '..'
import { Transaction } from '@iota/wallet'
import { OutputTypes } from '@iota/types'
import { OUTPUT_TYPE_FOUNDRY } from '@core/wallet/constants'

export function getRelevantOutputFromTransaction(
    transaction: Transaction,
    accountAddress: string,
    isFoundry: boolean
): { output: OutputTypes; outputIndex: number } {
    const outputs = transaction.payload.essence.outputs

    if (isFoundry) {
        const outputIndex = outputs.findIndex((output) => output.type === OUTPUT_TYPE_FOUNDRY)
        return { output: outputs[outputIndex], outputIndex: outputIndex }
    }

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
        }
    } else {
        if (outputs.every((output) => accountAddress === getRecipientAddressFromOutput(output))) {
            const outputIndex = outputs.findIndex((output) => accountAddress === getRecipientAddressFromOutput(output))

            return { output: outputs[outputIndex], outputIndex: outputIndex }
        }
    }
    return { output: undefined, outputIndex: undefined }
}
