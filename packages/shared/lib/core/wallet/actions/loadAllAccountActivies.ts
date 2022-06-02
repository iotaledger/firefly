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
        Object.keys(account.meta.transactions).forEach((transactionId) => {
            addActivityToAccountActivitiesInAllAccountActivities(
                account.id,
                new Activity().setFromTransaction(transactionId, account.meta.transactions?.[transactionId])
            )
        })
        Object.keys(account.meta.outputs).forEach((outputId) => {
            const output = account.meta.outputs?.[outputId]
            if (!output.remainder) {
                addActivityToAccountActivitiesInAllAccountActivities(
                    account.id,
                    new Activity().setFromOutput(outputId, output)
                )
            }
        })
    }
}
