import { getRecipientAddressFromOutput } from '..'
import { IWrappedOutput } from '@core/wallet/interfaces'

export function getMainOutputFromTransaction(
    wrappedOutputs: IWrappedOutput[],
    accountAddress: string,
    isIncoming: boolean
): { wrappedOutput: IWrappedOutput; isOnlyOutput: boolean } {
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
            isOnlyOutput: false,
        }
    } else {
        const output = wrappedOutputs.find(
            (outputData) => accountAddress === getRecipientAddressFromOutput(outputData.output)
        )
        if (output) {
            return { wrappedOutput: output, isOnlyOutput: true }
        }
    }
    return { wrappedOutput: undefined, isOnlyOutput: undefined }
}
