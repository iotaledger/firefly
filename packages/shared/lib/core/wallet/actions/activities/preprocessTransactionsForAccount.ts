import { IAccountState } from '@core/account'
import { preprocessTransaction } from '../../utils'
import { IProcessedTransaction } from '../../interfaces/processed-transaction.interface'

export async function preprocessTransactionsForAccount(account: IAccountState): Promise<IProcessedTransaction[]> {
    const transactions = await account.listTransactions()

    const processedTransactions: IProcessedTransaction[] = transactions.map((transaction) =>
        preprocessTransaction(transaction)
    )
    return processedTransactions
}
