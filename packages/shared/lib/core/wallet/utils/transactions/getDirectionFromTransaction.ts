import { AddressWithOutputs } from '@core/account/interfaces'
import { IWrappedOutput } from '../../interfaces'
import { getRecipientAddressFromOutput } from '../outputs/getRecipientAddressFromOutput'
import { ActivityDirection } from '@core/wallet/enums'
import { CommonOutput } from '@iota/sdk/out/types'

export function getDirectionFromTransaction(
    wrappedOutputs: IWrappedOutput[],
    incoming: boolean,
    accountAddressesWithOutputs: AddressWithOutputs[]
): ActivityDirection {
    const accountAddresses = accountAddressesWithOutputs.map((addressWithOutputs) => addressWithOutputs.address)

    const isAccountRecepient = wrappedOutputs.some((outputData) => {
        const outputRecipient = getRecipientAddressFromOutput(outputData.output as CommonOutput)
        return accountAddresses.includes(outputRecipient)
    })

    const isSelfTransaction = incoming && isAccountRecepient

    if (isSelfTransaction) {
        return ActivityDirection.SelfTransaction
    } else {
        return incoming ? ActivityDirection.Incoming : ActivityDirection.Outgoing
    }
}
