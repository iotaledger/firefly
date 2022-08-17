import { IAccountState } from '@core/account'
import { preprocessGroupedOutputs } from '@core/wallet/utils/outputs/preprocessGroupedOutputs'
import { OutputData } from '@iota/wallet'
import { IProcessedTransaction } from '../../interfaces/processed-transaction.interface'

export function preprocessAccountOutputs(account: IAccountState): IProcessedTransaction[] {
    const groupedOutputs: { [key: string]: OutputData[] } = {}

    for (const outputId of Object.keys(account.meta.outputs)) {
        const output = account.meta.outputs?.[outputId]
        const transactionId = output?.metadata?.transactionId
        if (!groupedOutputs[transactionId]) {
            groupedOutputs[transactionId] = []
        }
        groupedOutputs[transactionId].push(output)
    }

    const processedTransactions: IProcessedTransaction[] = []
    for (const transactionId of Object.keys(groupedOutputs)) {
        const hasTransaction = !!account?.meta?.transactions?.[transactionId]
        if (!hasTransaction) {
            processedTransactions.push(
                preprocessGroupedOutputs(
                    groupedOutputs[transactionId],
                    account?.meta?.incomingTransactions[transactionId]
                )
            )
        }
    }
    return processedTransactions
}
