import { IProcessedOutput } from '../../interfaces'
import { IAccountState } from '@core/account'
import { containsFoundryOutput, getRelevantOutputFromTransaction, outputIdFromTransactionData } from '../../utils'
import { Transaction } from '@iota/wallet'

export function preprocessTransaction(transaction: Transaction, account: IAccountState): IProcessedOutput {
    const isFoundry = containsFoundryOutput(transaction)
    const { output, outputIndex, isSelfTransaction } = getRelevantOutputFromTransaction(
        transaction,
        account.depositAddress,
        isFoundry
    )
    const outputId = outputIdFromTransactionData(transaction.transactionId, outputIndex)

    return {
        type: isFoundry ? 'foundry' : 'default',
        output: output,
        outputId: outputId,
        transactionId: transaction.transactionId,
        time: new Date(Number(transaction.timestamp)),
        claimingOutput: undefined,
        isSelfTransaction,
        inclusionState: transaction.inclusionState,
        transactionInputs: [],
        transactionInputs2: transaction.payload.essence.inputs,
    }
}
