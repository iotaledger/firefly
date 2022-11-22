import { IProcessedTransaction, IWrappedOutput } from '../../interfaces'
import { Transaction } from '@iota/wallet'
import { outputIdFromTransactionData } from './outputIdFromTransactionData'
import { OUTPUT_TYPE_TREASURY } from '@core/wallet/constants'
import { getRecipientAddressFromOutput } from './getRecipientAddressFromOutput'
import { ActivityDirection } from '@core/wallet/enums'

export function preprocessTransaction(transaction: Transaction, accountAddress: string): IProcessedTransaction {
    const outputs = transaction.payload.essence.outputs.map((output, index) => {
        const outputId = outputIdFromTransactionData(transaction.transactionId, index)
        return { outputId, output: output.type !== OUTPUT_TYPE_TREASURY ? output : undefined }
    })

    const direction = getDirectionFromTransaction(outputs, transaction.incoming, accountAddress)
    return {
        outputs: outputs,
        transactionId: transaction.transactionId,
        direction,
        time: new Date(Number(transaction.timestamp)),
        inclusionState: transaction.inclusionState,
        detailedTransactionInputs: [],
        transactionInputs: transaction.payload.essence.inputs,
    }
}

function getDirectionFromTransaction(
    wrappedOutputs: IWrappedOutput[],
    incoming: boolean,
    accountAddress: string
): ActivityDirection {
    const containsOutput = wrappedOutputs.some((outputData) => {
        const recipientAddress = getRecipientAddressFromOutput(outputData.output)

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
            (outputData) => accountAddress === getRecipientAddressFromOutput(outputData.output)
        )
        return isSelfTransaction ? ActivityDirection.SelfTransaction : ActivityDirection.Incoming
    }
}
