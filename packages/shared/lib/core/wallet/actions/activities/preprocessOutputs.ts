import { IAccountState } from '@core/account'
import { preprocessOutput } from '@core/wallet/utils/outputs/preprocessOutput'
import { OutputData } from '@iota/wallet'
import { IProcessedTransaction } from '../../interfaces/processed-transaction.interface'

export function preprocessOutputs(account: IAccountState): IProcessedTransaction[] {
    const groupedOutputs: { [key: string]: OutputData[] } = {}

    for (const outputId of Object.keys(account.meta.outputs)) {
        const output = account.meta.outputs?.[outputId]
        const transactionId = output?.metadata?.transactionId
        if (!groupedOutputs[transactionId]) {
            groupedOutputs[transactionId] = []
        }
        groupedOutputs[transactionId].push(output)
    }

    const preparedActivities: IProcessedTransaction[] = []
    for (const transactionId of Object.keys(groupedOutputs)) {
        const hasTransaction = !!account?.meta?.transactions?.[transactionId]
        if (!hasTransaction) {
            // TODO: group all outputs from same transaction together
            preparedActivities.push(
                preprocessOutput(groupedOutputs[transactionId], account?.meta?.incomingTransactions[transactionId])
            )
        }
    }
    return preparedActivities
}
