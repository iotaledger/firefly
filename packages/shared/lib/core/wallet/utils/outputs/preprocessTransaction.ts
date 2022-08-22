import { IProcessedTransaction } from '../../interfaces'
import { Transaction } from '@iota/wallet'

export function preprocessTransaction(transaction: Transaction): IProcessedTransaction {
    return {
        outputs: transaction.payload.essence.outputs,
        transactionId: transaction.transactionId,
        isIncoming: transaction.incoming,
        time: new Date(Number(transaction.timestamp)),
        inclusionState: transaction.inclusionState,
        detailedTransactionInputs: [],
        transactionInputs: transaction.payload.essence.inputs,
    }
}
