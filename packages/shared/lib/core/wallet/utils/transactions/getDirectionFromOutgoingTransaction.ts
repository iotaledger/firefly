import { AddressWithOutputs } from '@core/account/interfaces'
import { IWrappedOutput } from '../../interfaces'
import { getRecipientAddressFromOutput } from '../outputs/getRecipientAddressFromOutput'
import { ActivityDirection } from '@core/wallet/enums'
import { CommonOutput } from '@iota/sdk/out/types'

// TODO(2.0) Fix all usages
export function getDirectionFromOutgoingTransaction(
    wrappedOutputs: IWrappedOutput[],
    accountAddressesWithOutputs: AddressWithOutputs[]
): ActivityDirection {
    const accountAddresses = accountAddressesWithOutputs.map((addressWithOutputs) => addressWithOutputs.address)
    // Check if any output is not destined for the account
    const containsNonAccountRecipient = wrappedOutputs.some((outputData) => {
        const outputRecipient = getRecipientAddressFromOutput(outputData.output as CommonOutput)
        return !accountAddresses.includes(outputRecipient)
    })

    // If there is any output not destined for the account, it's an outgoing transaction.
    return containsNonAccountRecipient ? ActivityDirection.Outgoing : ActivityDirection.SelfTransaction
}
