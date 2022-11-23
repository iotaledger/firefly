import { IAccountState } from '@core/account'
import { preprocessGroupedOutputs } from '@core/wallet/utils/outputs/preprocessGroupedOutputs'
import { OutputData, Transaction } from '@iota/wallet'
import { IProcessedTransaction } from '../../interfaces'
import { IOutputResponse, ITransactionPayload } from '@iota/types'

export async function preprocessOutputsForAccount(account: IAccountState): Promise<IProcessedTransaction[]> {
    const outputs = await account.outputs()

    const transactions = await account.transactions()
    const transactionMap = getTransactionsMapFromList(transactions)
    const incomingTransactions = getMapFromList(await account.incomingTransactions())

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
        try {
            const incomingTransaction = incomingTransactions[transactionId]
            const processedTransaction = preprocessGroupedOutputs(
                groupedOutputs[transactionId],
                incomingTransaction,
                account
            )

            processedTransactions.push(processedTransaction)
        } catch (err) {
            console.error(err)
        }
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

function getMapFromList(transactions: [string, [ITransactionPayload, IOutputResponse[]]][]): {
    [transactionId: string]: [ITransactionPayload, IOutputResponse[]]
} {
    const transactionMap = {}
    for (const [transactionId, payload] of transactions) {
        transactionMap[transactionId] = payload
    }
    return transactionMap
}
