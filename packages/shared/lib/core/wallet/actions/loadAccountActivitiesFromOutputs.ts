import { IAccountState } from '@core/account'
import { Activity } from '../classes'
import { addActivityToAccountActivitiesInAllAccountActivities } from '../stores'

export async function loadAccountActivitiesFromOutputs(account: IAccountState): Promise<void> {
    for (const outputId of Object.keys(account.meta.outputs)) {
        const output = account.meta.outputs?.[outputId]
        if (!output.remainder) {
            const transactionId = output?.metadata?.transactionId
            const incomingTransaction = account.meta.incomingTransactions[transactionId]
            const hasTransaction = !!account?.meta?.transactions?.[transactionId]
            if (!hasTransaction) {
                addActivityToAccountActivitiesInAllAccountActivities(
                    account.id,
                    await new Activity().setFromOutputData(output, account, incomingTransaction?.[1])
                )
            }
        }
    }
}
