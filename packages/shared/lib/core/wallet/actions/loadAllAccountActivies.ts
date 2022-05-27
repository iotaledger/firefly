import { activeAccounts } from '@core/profile'
import { get } from 'svelte/store'
import { Activity } from '../classes'
import {
    addActivityToAccountActivitiesInAllAccountActivities,
    addEmptyAccountActivitiesToAllAccountActivities,
} from '../stores'

export function loadAllAccountActivities(): void {
    for (const account of get(activeAccounts)) {
        addEmptyAccountActivitiesToAllAccountActivities(account.id)
        account.meta.transactions.forEach((transaction) => {
            addActivityToAccountActivitiesInAllAccountActivities(
                account.id,
                new Activity().setFromTransaction(transaction)
            )
        })
    }
}
