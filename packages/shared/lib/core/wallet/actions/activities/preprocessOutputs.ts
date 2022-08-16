import { IAccountState } from '@core/account'
import { preprocessOutput } from '../../utils'
import { IProcessedTransaction } from '../../interfaces/processed-transaction.interface'

export function preprocessOutputs(account: IAccountState): IProcessedTransaction[] {
    const preparedActivities: IProcessedTransaction[] = []
    for (const outputId of Object.keys(account.meta.outputs)) {
        const output = account.meta.outputs?.[outputId]
        if (!output.remainder) {
            const transactionId = output?.metadata?.transactionId
            const incomingTransaction = account.meta.incomingTransactions[transactionId]
            const hasTransaction = !!account?.meta?.transactions?.[transactionId]
            if (!hasTransaction) {
                // TODO: group all outputs from same transaction together
                preparedActivities.push(preprocessOutput(output, incomingTransaction?.[1]))
            }
        }
    }
    return preparedActivities
}
