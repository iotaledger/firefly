import { syncBalance } from '@core/account/actions/syncBalance'
import { updateNftInAllAccountNfts } from '@core/nfts'
import { ActivityAsyncStatus, ActivityDirection, ActivityType } from '@core/wallet/enums'
import { allAccountActivities } from '../../stores'
import { refreshAccountAssetsForActiveProfile } from '../refreshAccountAssetsForActiveProfile'

export function setAsyncStatusOfAccountActivities(time: Date): void {
    const balancesToUpdate: number[] = []
    allAccountActivities.update((state) => {
        state.forEach((accountActivities, accountIndex) => {
            for (const activity of accountActivities.filter(
                (_activity) =>
                    (_activity.data.type === ActivityType.Transaction || _activity.data.type === ActivityType.Nft) &&
                    (_activity.data.isAsync || _activity.data.timelockDate)
            )) {
                if (activity.data.type === ActivityType.Transaction || activity.data.type === ActivityType.Nft) {
                    const oldAsyncStatus = activity.data.asyncStatus
                    activity.data.asyncStatus = activity.getAsyncStatus(time)

                    if (oldAsyncStatus !== null && oldAsyncStatus !== activity.data.asyncStatus) {
                        if (!balancesToUpdate.includes(accountIndex)) {
                            balancesToUpdate.push(accountIndex)
                        }

                        if (
                            activity.data.type === ActivityType.Nft &&
                            activity.data.asyncStatus === ActivityAsyncStatus.Expired &&
                            activity.data.direction === ActivityDirection.Outgoing
                        ) {
                            updateNftInAllAccountNfts(accountIndex, activity.data.nftId, { isOwned: true })
                        }
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
