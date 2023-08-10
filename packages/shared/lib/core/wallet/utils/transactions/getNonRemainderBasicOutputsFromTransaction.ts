import { getRecipientAddressFromOutput } from '..'
import { IWrappedOutput } from '@core/wallet/interfaces'
import { ActivityDirection } from '@core/wallet/enums'
import { CommonOutput } from '@iota/wallet'

export function getNonRemainderBasicOutputsFromTransaction(
    wrappedOutputs: IWrappedOutput[],
    accountAddress: string,
    direction: ActivityDirection
): IWrappedOutput[] {
    return wrappedOutputs.filter((outputData) => {
        const recipientAddress = getRecipientAddressFromOutput(outputData.output as CommonOutput)

        if (direction === ActivityDirection.Incoming || direction === ActivityDirection.SelfTransaction) {
            return accountAddress === recipientAddress
        } else {
            return accountAddress !== recipientAddress
        }
    })
}
