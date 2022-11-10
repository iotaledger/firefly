import { IProcessedTransaction } from '../../interfaces'
import { Transaction } from '@iota/wallet'
import { outputIdFromTransactionData } from './outputIdFromTransactionData'
import { OUTPUT_TYPE_TREASURY } from '@core/wallet/constants'

export function preprocessTransaction(transaction: Transaction): IProcessedTransaction {
    const outputs = transaction.payload.essence.outputs.map((output, index) => {
        const outputId = outputIdFromTransactionData(transaction.transactionId, index)
        return { outputId, output: output.type !== OUTPUT_TYPE_TREASURY ? output : undefined }
    })
    return {
        outputs: outputs,
        transactionId: transaction.transactionId,
        isIncoming: transaction.incoming,
        time: new Date(Number(transaction.timestamp)),
        inclusionState: transaction.inclusionState,
        detailedTransactionInputs: [],
        transactionInputs: transaction.payload.essence.inputs,
    }
}
