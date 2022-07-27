import { IAccountState } from '@core/account'
import { Activity } from '../classes'
import { addActivityToAccountActivitiesInAllAccountActivities } from '../stores'

export function loadAccountActivitiesFromOutputs(account: IAccountState): void {
    Object.keys(account.meta.outputs).forEach((outputId) => {
        const output = account.meta.outputs?.[outputId]
        if (!output.remainder) {
            const transactionId = output?.metadata?.transactionId
            const incomingTransaction = account.meta.incomingTransactions[transactionId]
            const hasTransaction = !!account?.meta?.transactions?.[transactionId]
            if (!hasTransaction) {
                addActivityToAccountActivitiesInAllAccountActivities(
                    account.id,
                    new Activity().setFromOutputData(output, account, incomingTransaction?.[0], undefined)
                )
            }
        }
    })
}
