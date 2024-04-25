import { getRecipientAddressFromOutput } from '..'
import { IWrappedOutput } from '@core/wallet/interfaces'
import { ActivityDirection } from '@core/wallet/enums'
import { CommonOutput } from '@iota/sdk/out/types'

export function getNonRemainderBasicOutputsFromTransaction(
    wrappedOutputs: IWrappedOutput[],
    validAddresses: string[],
    direction: ActivityDirection
): IWrappedOutput[] {
    return wrappedOutputs.filter((outputData) => {
        const recipientAddress = getRecipientAddressFromOutput(outputData.output as CommonOutput)
        if (direction === ActivityDirection.Incoming || direction === ActivityDirection.SelfTransaction) {
            return true && validAddresses.includes(recipientAddress)
        } else {
            return !validAddresses.includes(recipientAddress)
        }
    })
}
