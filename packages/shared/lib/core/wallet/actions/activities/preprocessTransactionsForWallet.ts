import { IWalletState } from '@core/wallet/interfaces'
import { preprocessOutgoingTransaction } from '../../utils'
import { ProcessedTransaction } from '../../interfaces/processed-transaction.interface'

export async function preprocessTransactionsForWallet(wallet: IWalletState): Promise<ProcessedTransaction[]> {
    const transactions = await wallet.transactions()
    console.log(transactions)

    const processedTransactions: ProcessedTransaction[] = []

    for (const transaction of transactions) {
        try {
            const processedTransaction = await preprocessOutgoingTransaction(transaction, wallet)
            processedTransactions.push(processedTransaction)
        } catch (err) {
            console.error(err)
        }
    }
    return processedTransactions
}
