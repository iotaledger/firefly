import { syncBalance } from '@core/account/actions/syncBalance'
import { ActivityAsyncStatus, ActivityType } from '@core/wallet/enums'
import { TransactionActivity } from '@core/wallet/types'
import { allAccountActivities } from '../../stores'
import { refreshAccountAssetsForActiveProfile } from '../refreshAccountAssetsForActiveProfile'

export function setAsyncStatusOfAccountActivities(time: Date): void {
    const balancesToUpdate: number[] = []
    allAccountActivities.update((state) => {
        state.forEach((accountActivities, accountIndex) => {
            for (const activity of accountActivities.filter(
                (_activity) =>
                    _activity.type === ActivityType.Transaction && (_activity.isAsync || _activity.timelockDate)
            )) {
                if (activity.type === ActivityType.Transaction) {
                    const oldAsyncStatus = activity.asyncStatus
                    activity.asyncStatus = getAsyncStatus(activity, time)
                    if (
                        !balancesToUpdate.includes(accountIndex) &&
                        oldAsyncStatus !== null &&
                        oldAsyncStatus !== activity.asyncStatus
                    ) {
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
    if (balancesToUpdate.length) {
        void refreshAccountAssetsForActiveProfile()
    }
}

function getAsyncStatus(activity: TransactionActivity, time: Date): ActivityAsyncStatus {
    if (activity.timelockDate) {
        if (activity.timelockDate.getTime() > time.getTime()) {
            return ActivityAsyncStatus.Timelocked
        }
    }
    if (activity.isAsync) {
        if (activity.isClaimed) {
            return ActivityAsyncStatus.Claimed
        } else {
            if (time > activity.expirationDate) {
                return ActivityAsyncStatus.Expired
            } else {
                return ActivityAsyncStatus.Unclaimed
            }
        }
    }
}
