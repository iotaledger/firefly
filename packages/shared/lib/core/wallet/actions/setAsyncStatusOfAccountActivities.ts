import { syncBalance } from '@core/account/actions/syncBalance'
import { allAccountActivities } from '../stores'

export function setAsyncStatusOfAccountActivities(time: Date): void {
    const balancesToUpdate = []
    allAccountActivities.update((state) => {
        state.forEach((accountActivities, accountId) => {
            for (const activity of accountActivities) {
                const oldAsyncStatus = activity.asyncStatus
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
