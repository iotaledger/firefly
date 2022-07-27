import { IAccountState } from '@core/account'
import { Activity } from '../classes'
import { addActivityToAccountActivitiesInAllAccountActivities } from '../stores'

export async function loadAccountActivitiesFromTransactions(account: IAccountState): Promise<void> {
    for (const transactionId of Object.keys(account.meta.transactions)) {
        addActivityToAccountActivitiesInAllAccountActivities(
            account.id,
            await new Activity().setFromTransaction(account.meta.transactions?.[transactionId], account)
        )
    }
}
