import { IWrappedOutput } from '../../interfaces'
import { getRecipientAddressFromOutput } from '../outputs/getRecipientAddressFromOutput'
import { ActivityDirection } from '@core/wallet/enums'
import { CommonOutput } from '@iota/wallet'

export function getDirectionFromTransaction(
    wrappedOutputs: IWrappedOutput[],
    incoming: boolean,
    accountAddress: string
): ActivityDirection {
    const containsOutput = wrappedOutputs.some((outputData) => {
        const recipientAddress = getRecipientAddressFromOutput(outputData.output as CommonOutput)

        if (incoming) {
            return accountAddress === recipientAddress
        } else {
            return accountAddress !== recipientAddress
        }
    })
    if (containsOutput) {
        return incoming ? ActivityDirection.Incoming : ActivityDirection.Outgoing
    } else {
        const isSelfTransaction = wrappedOutputs.some(
            (outputData) => accountAddress === getRecipientAddressFromOutput(outputData.output as CommonOutput)
        )
        return isSelfTransaction ? ActivityDirection.SelfTransaction : ActivityDirection.Incoming
    }
}
