import type { OutputData, Transaction } from '@iota/wallet'

import type { IAccountState } from '@core/account/interfaces'

import { preprocessGroupedOutputs } from '../../utils/outputs'
import type { IProcessedTransaction } from '../../interfaces'
import type { IOutputResponse } from '@iota/types'

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
            const inputs: IOutputResponse[] = incomingTransactions[transactionId]?.inputs ?? []
            const processedTransaction = preprocessGroupedOutputs(groupedOutputs[transactionId], inputs, account)

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
        transactionMap[transaction?.transactionId] = true
    }
    return transactionMap
}

function getMapFromList(transactions: [string, Transaction][]): {
    [transactionId: string]: Transaction
} {
    const transactionMap = {}
    for (const [transactionId, payload] of transactions) {
        transactionMap[transactionId] = payload
    }
    return transactionMap
}
