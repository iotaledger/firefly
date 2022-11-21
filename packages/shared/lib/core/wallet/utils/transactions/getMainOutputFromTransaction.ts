import { getRecipientAddressFromOutput } from '..'
import { IWrappedOutput } from '@core/wallet/interfaces'

export function getMainOutputFromTransaction(
    wrappedOutputs: IWrappedOutput[],
    accountAddress: string,
    isIncoming: boolean
): { wrappedOutput: IWrappedOutput; isSelfTransaction: boolean } {
    const nonRemainerOutput = wrappedOutputs.find((outputData) => {
        const recipientAddress = getRecipientAddressFromOutput(outputData.output)

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
        const output = wrappedOutputs.find(
            (outputData) => accountAddress === getRecipientAddressFromOutput(outputData.output)
        )
        if (output) {
            return { wrappedOutput: output, isSelfTransaction: true }
        }
    }
    return { wrappedOutput: undefined, isSelfTransaction: undefined }
}
