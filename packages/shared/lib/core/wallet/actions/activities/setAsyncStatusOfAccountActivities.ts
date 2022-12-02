import { syncBalance } from '@core/account/actions/syncBalance'
import { Activity } from '@core/wallet/types'
import { updateNftInAllAccountNfts } from '@core/nfts'
import { ActivityAsyncStatus, ActivityDirection, ActivityType } from '@core/wallet/enums'
import { allAccountActivities } from '../../stores'
import { refreshAccountAssetsForActiveProfile } from '../refreshAccountAssetsForActiveProfile'

export function setAsyncStatusOfAccountActivities(time: Date): void {
    const balancesToUpdate: number[] = []
    allAccountActivities.update((state) => {
        state.forEach((accountActivities, accountIndex) => {
            for (const activity of accountActivities.filter((_activity) => _activity.asyncData)) {
                const oldAsyncStatus = activity.asyncData.asyncStatus
                if (oldAsyncStatus === ActivityAsyncStatus.Claimed || oldAsyncStatus === ActivityAsyncStatus.Expired) {
                    continue
                }
                activity.asyncData.asyncStatus = getAsyncStatus(activity, time)

                if (oldAsyncStatus !== null && oldAsyncStatus !== activity.asyncData.asyncStatus) {
                    if (!balancesToUpdate.includes(accountIndex)) {
                        balancesToUpdate.push(accountIndex)
                    }

                    if (
                        activity.type === ActivityType.Nft &&
                        activity.asyncData.asyncStatus === ActivityAsyncStatus.Expired &&
                        activity.direction === ActivityDirection.Outgoing
                    ) {
                        updateNftInAllAccountNfts(accountIndex, activity.nftId, { isSpendable: true })
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

function getAsyncStatus(activity: Activity, time: Date): ActivityAsyncStatus {
    if (activity.asyncData?.timelockDate) {
        if (activity.asyncData.timelockDate.getTime() > time.getTime()) {
            return ActivityAsyncStatus.Timelocked
        }
    } else if (activity.asyncData) {
        if (activity.asyncData.asyncStatus !== ActivityAsyncStatus.Claimed) {
            if (time > activity.asyncData.expirationDate) {
                return ActivityAsyncStatus.Expired
            } else {
                return ActivityAsyncStatus.Unclaimed
            }
        }
    }
}
