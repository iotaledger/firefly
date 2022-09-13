import { getRecipientAddressFromOutput } from '..'
import { IOutput } from '@core/wallet/interfaces'

export function getMainTransactionOutputFromTransaction(
    outputs: IOutput[],
    accountAddress: string,
    isIncoming: boolean
): { wrappedOutput: IOutput; isSelfTransaction: boolean } {
    const nonRemainerOutput = outputs.find((output) => {
        const recipientAddress = getRecipientAddressFromOutput(output.output)

        if (isIncoming) {
            return accountAddress === recipientAddress
        } else {
            return accountAddress !== recipientAddress
        }
    })
    if (nonRemainerOutput) {
        return {
            wrappedOutput: nonRemainerOutput,
            isSelfTransaction: false,
        }
    } else {
        const output = outputs.find((output) => accountAddress === getRecipientAddressFromOutput(output.output))
        if (output) {
            return { wrappedOutput: output, isSelfTransaction: true }
        }
    }
    return { wrappedOutput: undefined, isSelfTransaction: undefined }
}
