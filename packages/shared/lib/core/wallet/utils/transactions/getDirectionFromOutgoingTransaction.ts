import { getRecipientAddressFromOutput } from '../outputs/getRecipientAddressFromOutput'
import { ActivityDirection } from '@core/wallet/enums'
import { CommonOutput, Output } from '@iota/sdk/out/types'

export function getDirectionFromOutgoingTransaction(
    outputs: Output[],
    walletDepositAddress: string
): ActivityDirection {
    // Check if any output is not destined for the wallet
    const containsNonWalletRecipient = outputs.some((output) => {
        const outputRecipient = getRecipientAddressFromOutput(output as CommonOutput)
        return walletDepositAddress !== outputRecipient
    })

    // If there is any output not destined for the wallet, it's an outgoing transaction.
    return containsNonWalletRecipient ? ActivityDirection.Outgoing : ActivityDirection.SelfTransaction
}
