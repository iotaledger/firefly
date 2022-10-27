import { syncBalance } from '@core/account/actions/syncBalance'
import { ActivityAsyncStatus, ActivityType } from '@core/wallet/enums'
import { TransactionActivity } from '@core/wallet/types'
import { allAccountActivities } from '../../stores'
import { refreshAccountAssetsForActiveProfile } from '../refreshAccountAssetsForActiveProfile'

export function setAsyncStatusOfAccountActivities(time: Date): void {
    const balancesToUpdate: number[] = []
    allAccountActivities.update((state) => {
        state.forEach((accountActivities, accountIndex) => {
            for (const activity of accountActivities.filter((_activity) => _activity.asyncData)) {
                if (activity.type === ActivityType.Transaction) {
                    const oldAsyncStatus = activity.asyncData.asyncStatus
                    activity.asyncData.asyncStatus = getAsyncStatus(activity, time)
                    if (
                        !balancesToUpdate.includes(accountIndex) &&
                        oldAsyncStatus !== null &&
                        oldAsyncStatus !== activity.asyncData.asyncStatus
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
    if (activity.asyncData?.timelockDate) {
        if (activity.asyncData.timelockDate.getTime() > time.getTime()) {
            return ActivityAsyncStatus.Timelocked
        }
    } else if (activity.asyncData) {
        if (activity.asyncData.isClaimed) {
            return ActivityAsyncStatus.Claimed
        } else {
            if (time > activity.asyncData.expirationDate) {
                return ActivityAsyncStatus.Expired
            } else {
                return ActivityAsyncStatus.Unclaimed
            }
        }
    }
}
