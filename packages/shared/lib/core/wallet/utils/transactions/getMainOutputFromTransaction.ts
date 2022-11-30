import { getRecipientAddressFromOutput } from '..'
import { IWrappedOutput } from '@core/wallet/interfaces'
import { ActivityDirection } from '@core/wallet/enums'

export function getMainOutputFromTransaction(
    wrappedOutputs: IWrappedOutput[],
    accountAddress: string,
    direction: ActivityDirection
): IWrappedOutput {
    return wrappedOutputs.find((outputData) => {
        const recipientAddress = getRecipientAddressFromOutput(outputData.output)

        if (direction === ActivityDirection.Incoming || direction === ActivityDirection.SelfTransaction) {
            return accountAddress === recipientAddress
        } else {
            return accountAddress !== recipientAddress
        }
    })
}
