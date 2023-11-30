import { getRecipientAddressFromOutput } from '..'
import { AddressWithOutputs, IWrappedOutput } from '@core/wallet/interfaces'
import { ActivityDirection } from '@core/wallet/enums'
import { CommonOutput } from '@iota/sdk/out/types'

// TODO(2.0) Fix all usages
export function getNonRemainderBasicOutputsFromTransaction(
    wrappedOutputs: IWrappedOutput[],
    accountAddressesWithOutputs: AddressWithOutputs[],
    direction: ActivityDirection
): IWrappedOutput[] {
    const accountAddresses = accountAddressesWithOutputs.map((addressWithOutputs) => addressWithOutputs.address)

    return wrappedOutputs.filter((outputData) => {
        const recipientAddress = getRecipientAddressFromOutput(outputData.output as CommonOutput)

        if (direction === ActivityDirection.Incoming || direction === ActivityDirection.SelfTransaction) {
            return !outputData.remainder && accountAddresses.includes(recipientAddress)
        } else {
            return !accountAddresses.includes(recipientAddress)
        }
    })
}
