import { getRecipientAddressFromOutput } from '..'
import { IWrappedOutput } from '@core/wallet/interfaces'
import { ActivityDirection } from '@core/wallet/enums'
import { CommonOutput } from '@iota/sdk/out/types'
import { AddressWithOutputs } from '@core/account'

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
