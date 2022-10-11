import { syncBalance } from '@core/account/actions/syncBalance'
import { ActivityType } from '@core/wallet/enums'
import { allAccountActivities } from '../../stores'

export function setAsyncStatusOfAccountActivities(time: Date): void {
    const balancesToUpdate: number[] = []
    allAccountActivities.update((state) => {
        state.forEach((accountActivities, accountIndex) => {
            for (const activity of accountActivities.filter(
                (_activity) =>
                    _activity.data.type === ActivityType.Transaction &&
                    (_activity.data.isAsync || _activity.data.timelockDate)
            )) {
                if (activity.data.type === ActivityType.Transaction) {
                    const oldAsyncStatus = activity.data.asyncStatus
                    activity.data.asyncStatus = activity.getAsyncStatus(time)
                    if (!balancesToUpdate.includes(accountIndex) && oldAsyncStatus !== activity.data.asyncStatus) {
                        balancesToUpdate.push(accountIndex)
                    }
                }
            }
        })
        return state
    })
    for (const accountIndex of balancesToUpdate) {
        syncBalance(accountIndex)
    }
}
