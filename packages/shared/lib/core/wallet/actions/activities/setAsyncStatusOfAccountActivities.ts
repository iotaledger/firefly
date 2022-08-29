import { syncBalance } from '@core/account/actions/syncBalance'
import { ActivityType } from '@core/wallet/enums'
import { allAccountActivities } from '../../stores'

export function setAsyncStatusOfAccountActivities(time: Date): void {
    const balancesToUpdate = []
    allAccountActivities.update((state) => {
        state.forEach((accountActivities, accountId) => {
            for (const activity of accountActivities.filter(
                (_activity) => _activity.data.type === ActivityType.Transaction && _activity.data.isAsync
            )) {
                if (activity.data.type === ActivityType.Transaction) {
                    const oldAsyncStatus = activity.data.asyncStatus
                    activity.data.asyncStatus = activity.getAsyncStatus(time)
                    if (!balancesToUpdate.includes(accountId) && oldAsyncStatus !== activity.data.asyncStatus) {
                        balancesToUpdate.push(accountId)
                    }
                }
            }
        })
        return state
    })
    for (const accountId of balancesToUpdate) {
        syncBalance(accountId.toString())
    }
}
