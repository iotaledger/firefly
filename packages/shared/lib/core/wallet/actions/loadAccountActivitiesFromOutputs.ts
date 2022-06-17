import { IAccountState } from '@core/account'
import { Activity } from '../classes'
import { addActivityToAccountActivitiesInAllAccountActivities } from '../stores'

export function loadAccountActivitiesFromOutputs(account: IAccountState): void {
    Object.keys(account.meta.outputs).forEach((outputId) => {
        const output = account.meta.outputs?.[outputId]
        if (!output.remainder) {
            const hasTransaction = !!account?.meta?.transactions?.[output?.metadata?.transactionId]
            if (!hasTransaction) {
                addActivityToAccountActivitiesInAllAccountActivities(
                    account.id,
                    new Activity().setFromOutputData(output, account)
                )
            }
        }
    })
}
