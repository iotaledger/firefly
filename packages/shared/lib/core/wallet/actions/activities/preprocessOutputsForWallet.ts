import type { OutputData, OutputWithMetadata, TransactionWithMetadata } from '@iota/sdk/out/types'
import { IWalletState } from '@core/wallet/interfaces'
import { preprocessGroupedOutputs } from '../../utils/outputs'
import { ProcessedTransaction } from '../../interfaces'

// TODO: Fix this.
export async function preprocessOutputsForWallet(wallet: IWalletState): Promise<ProcessedTransaction[]> {
    const outputs = await wallet.outputs()
    console.log(outputs)

    const transactions = await wallet.transactions()
    const transactionsSet = txsListToSet(transactions)
    const incomingTransactions = txsListToMap(await wallet.incomingTransactions())

    const groupedOutputs = new Map<string, OutputData[]>();
    for (const output of outputs) {
        const blockId = output?.metadata?.blockId 

        const hasBlock = transactionsSet.has(blockId);
        if (!hasBlock) {
            if (!groupedOutputs.has(blockId)) {
                groupedOutputs.set(blockId, [])
            }
            groupedOutputs.get(blockId)?.push(output)
        }
    }

    const processedTransactions: ProcessedTransaction[] = []
    for (const blockId of Object.keys(groupedOutputs)) {
        try {
            const transaction = incomingTransactions.get(blockId)
            const inputs: OutputWithMetadata[] = transaction?.inputs ?? []
            const outputs = groupedOutputs.get(blockId) ?? [];
            const processedTransaction = preprocessGroupedOutputs(outputs, inputs, wallet)

            processedTransactions.push(processedTransaction)
        } catch (err) {
            console.error(err)
        }
    }
    return processedTransactions
}

function txsListToSet(transactions: TransactionWithMetadata[]): Set<string> {
    const blocksSet = new Set<string>();
    for (const transaction of transactions) {
        if(transaction.blockId){
            blocksSet.add(transaction.blockId);
        }
    }
    return blocksSet
}

function txsListToMap(transactions: TransactionWithMetadata[]): Map<string, TransactionWithMetadata> {
    const transactionMap = new Map();
    for (const transaction of transactions) {
        transactionMap.set(transaction.blockId, transaction);
    }
    return transactionMap
}
