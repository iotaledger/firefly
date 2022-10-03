import { IAccountState } from '@core/account'
import { preprocessGroupedOutputs } from '@core/wallet/utils/outputs/preprocessGroupedOutputs'
import { OutputData, Transaction } from '@iota/wallet'
import { IProcessedTransaction } from '../../interfaces/processed-transaction.interface'

export async function preprocessOutputsForAccount(account: IAccountState): Promise<IProcessedTransaction[]> {
    const outputs = await account.outputs()

    const transactions = await account.transactions()
    const transactionMap = getTransactionsMapFromList(transactions)
    // TODO: uncomment this when `account.listIncomingTransactions()` is implemented
    // const incomingTransactions = await account.listIncomingTransactions()
    // const incomingTransactionMap = getTransactionsMapFromList(incomingTransactions)
    const incomingTransactionMap = account?.meta?.incomingTransactions

    const groupedOutputs: { [key: string]: OutputData[] } = {}
    for (const output of outputs) {
        const transactionId = output?.metadata?.transactionId

        const hasTransaction = !!transactionMap[transactionId]
        if (!hasTransaction) {
            if (!groupedOutputs[transactionId]) {
                groupedOutputs[transactionId] = []
            }
            groupedOutputs[transactionId].push(output)
        }
    }

    const processedTransactions: IProcessedTransaction[] = []
    for (const transactionId of Object.keys(groupedOutputs)) {
        processedTransactions.push(
            preprocessGroupedOutputs(groupedOutputs[transactionId], incomingTransactionMap[transactionId], account)
        )
    }
    return processedTransactions
}

function getTransactionsMapFromList(transactions: Transaction[]): { [transactionId: string]: boolean } {
    const transactionMap = {}
    for (const transaction of transactions) {
        transactionMap[transaction.transactionId] = true
    }
    return transactionMap
}
