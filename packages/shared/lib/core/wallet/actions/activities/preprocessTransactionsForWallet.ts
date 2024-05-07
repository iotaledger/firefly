import { IWalletState } from '@core/wallet/interfaces'
import { preprocessIncomingTransaction, preprocessOutgoingTransaction } from '../../utils'
import { IProcessedTransaction } from '../../interfaces/processed-transaction.interface'

export async function preprocessTransactionsForWallet(wallet: IWalletState): Promise<IProcessedTransaction[]> {
    const processedTransactions: IProcessedTransaction[] = []
    const transactions = await wallet.transactions()

    for (const transaction of transactions) {
        try {
            const processedTransaction = await preprocessOutgoingTransaction(transaction, wallet)
            processedTransactions.push(processedTransaction)
        } catch (err) {
            console.error(err)
        }
    }
    const incomingTransactions = await wallet.incomingTransactions()
    for (const incomingTransaction of incomingTransactions) {
        try {
            const processedTransaction = await preprocessIncomingTransaction(incomingTransaction, wallet)
            processedTransactions.push(processedTransaction)
        } catch (err) {
            console.error(err)
        }
    }
    return processedTransactions
}
