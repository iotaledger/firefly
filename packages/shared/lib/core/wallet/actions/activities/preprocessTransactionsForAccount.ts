import { IAccountState } from '@core/account'
import { preprocessTransaction } from '../../utils'
import { IProcessedTransaction } from '../../interfaces/processed-transaction.interface'

export function preprocessTransactionsForAccount(account: IAccountState): IProcessedTransaction[] {
    const processedTransactions: IProcessedTransaction[] = []
    for (const transactionId of Object.keys(account.meta.transactions)) {
        const transaction = account.meta.transactions?.[transactionId]
        processedTransactions.push(preprocessTransaction(transaction))
    }
    return processedTransactions
}
