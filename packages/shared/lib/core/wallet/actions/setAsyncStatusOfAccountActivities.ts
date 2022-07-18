import { syncBalance } from '@core/account/actions/syncBalance'
import { allAccountActivities } from '../stores'

export function setAsyncStatusOfAccountActivities(time: Date): void {
    const balancesToUpdate = []
    allAccountActivities.update((state) => {
        state.forEach((accountActivities, accountId) => {
            for (const activity of accountActivities) {
                // Fallback to null because getAsyncStatus(time) returns null for non-async activities
                // Otherwise, activity.asyncStatus results undefined and therefore oldAsyncStatus !== activity.asyncStatus check would fail
                const oldAsyncStatus = activity.asyncStatus || null
                activity.asyncStatus = activity.getAsyncStatus(time)
                if (!balancesToUpdate.includes(accountId) && oldAsyncStatus !== activity.asyncStatus) {
                    balancesToUpdate.push(accountId)
                }
            }
        })
        return state
    })
    for (const accountId of balancesToUpdate) {
        syncBalance(accountId.toString())
    }
}
