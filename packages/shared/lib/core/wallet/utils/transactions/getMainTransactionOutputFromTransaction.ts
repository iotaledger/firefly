import { getRecipientAddressFromOutput } from '..'
import { IWrappedOutput } from '@core/wallet/interfaces'

export function getMainTransactionOutputFromTransaction(
    wrappedOutputs: IWrappedOutput[],
    accountAddress: string,
    isIncoming: boolean
): { wrappedOutput: IWrappedOutput; isSelfTransaction: boolean } {
    const nonRemainerOutput = wrappedOutputs.find((output) => {
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
        const output = wrappedOutputs.find((output) => accountAddress === getRecipientAddressFromOutput(output.output))
        if (output) {
            return { wrappedOutput: output, isSelfTransaction: true }
        }
    }
    return { wrappedOutput: undefined, isSelfTransaction: undefined }
}
