import { IAccountState } from '@core/account'
import { preprocessTransaction } from '../../utils'
import { IProcessedTransaction } from '../../interfaces/processed-transaction.interface'

export async function preprocessTransactionsForAccount(account: IAccountState): Promise<IProcessedTransaction[]> {
    const transactions = await account.transactions()

    const processedTransactions: IProcessedTransaction[] = []

    for (const transaction of transactions) {
        try {
            const processedTransaction = preprocessTransaction(transaction, account.depositAddress)
            processedTransactions.push(processedTransaction)
        } catch (err) {
            console.error(err)
        }
    }
    return processedTransactions
}
