import { IWrappedOutput } from '../../interfaces'
import { getRecipientAddressFromOutput } from '../outputs/getRecipientAddressFromOutput'
import { ActivityDirection } from '@core/wallet/enums'
import { CommonOutput } from '@iota/sdk/out/types'

export function getDirectionFromOutgoingTransaction(
    wrappedOutputs: IWrappedOutput[],
    walletDepositAddress: string
): ActivityDirection {
    // Check if any output is not destined for the wallet
    const containsNonWalletRecipient = wrappedOutputs.some((outputData) => {
        const outputRecipient = getRecipientAddressFromOutput(outputData.output as CommonOutput)
        return walletDepositAddress !== outputRecipient
    })

    // If there is any output not destined for the wallet, it's an outgoing transaction.
    return containsNonWalletRecipient ? ActivityDirection.Outgoing : ActivityDirection.SelfTransaction
}
