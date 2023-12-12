import type { OutputData, OutputResponse, TransactionWithMetadata } from '@iota/sdk/out/types'

import { IWalletState } from '@core/wallet/interfaces'

import { preprocessGroupedOutputs } from '../../utils/outputs'
import { IProcessedTransaction } from '../../interfaces'

export async function preprocessOutputsForWallet(wallet: IWalletState): Promise<IProcessedTransaction[]> {
    const outputs = await wallet.outputs()

    const transactions = await wallet.transactions()
    const transactionMap = getTransactionsMapFromList(transactions)
    const incomingTransactions = getMapFromList(await wallet.incomingTransactions())

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
            const inputs: OutputResponse[] = incomingTransactions[transactionId]?.inputs ?? []
            const processedTransaction = preprocessGroupedOutputs(groupedOutputs[transactionId], inputs, wallet)

            processedTransactions.push(processedTransaction)
        } catch (err) {
            console.error(err)
        }
    }
    return processedTransactions
}

function getTransactionsMapFromList(transactions: TransactionWithMetadata[]): { [transactionId: string]: boolean } {
    const transactionMap = {}
    for (const transaction of transactions) {
        transactionMap[transaction?.transactionId] = true
    }
    return transactionMap
}

function getMapFromList(transactions: TransactionWithMetadata[]): {
    [transactionId: string]: TransactionWithMetadata
} {
    const transactionMap = {}
    for (const transaction of transactions) {
        transactionMap[transaction.transactionId] = transaction
    }
    return transactionMap
}
