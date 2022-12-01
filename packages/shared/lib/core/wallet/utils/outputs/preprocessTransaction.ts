import { IProcessedTransaction } from '../../interfaces'
import { Transaction } from '@iota/wallet'
import { outputIdFromTransactionData } from './outputIdFromTransactionData'
import { OUTPUT_TYPE_TREASURY } from '@core/wallet/constants'
import { getDirectionFromTransaction } from '../transactions'

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
