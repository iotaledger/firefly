import { IAccountState } from '@core/account'
import { preprocessTransaction } from '../../utils'
import { IProcessedTransaction } from '../../interfaces/processed-transaction.interface'

export function preprocessTransactions(account: IAccountState): IProcessedTransaction[] {
    const preparedActivities: IProcessedTransaction[] = []
    for (const transactionId of Object.keys(account.meta.transactions)) {
        const transaction = account.meta.transactions?.[transactionId]
        preparedActivities.push(preprocessTransaction(transaction))
    }
    return preparedActivities
}
