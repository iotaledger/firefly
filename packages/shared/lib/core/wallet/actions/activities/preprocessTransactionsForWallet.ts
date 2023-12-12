import { IWalletState } from '@core/wallet/interfaces'
import { preprocessOutgoingTransaction } from '../../utils'
import { IProcessedTransaction } from '../../interfaces/processed-transaction.interface'

export async function preprocessTransactionsForWallet(wallet: IWalletState): Promise<IProcessedTransaction[]> {
    const transactions = await wallet.transactions()

    const processedTransactions: IProcessedTransaction[] = []

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
