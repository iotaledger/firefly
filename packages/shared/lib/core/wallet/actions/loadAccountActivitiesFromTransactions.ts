import { IAccountState } from '@core/account'
import { Activity } from '../classes'
import { addActivityToAccountActivitiesInAllAccountActivities } from '../stores'

export function loadAccountActivitiesFromTransactions(account: IAccountState): void {
    Object.keys(account.meta.transactions).forEach((transactionId) => {
        addActivityToAccountActivitiesInAllAccountActivities(
            account.id,
            new Activity().setFromTransaction(transactionId, account.meta.transactions?.[transactionId], account)
        )
    })
}
