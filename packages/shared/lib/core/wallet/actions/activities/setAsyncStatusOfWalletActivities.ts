import { syncBalance } from 'shared/lib/core/wallet/actions/syncBalance'
import { updateNftInAllWalletNfts } from '@core/nfts'
import { ActivityAsyncStatus, ActivityDirection, ActivityType } from '@core/wallet/enums'
import { allWalletActivities } from '../../stores'
import { refreshWalletAssetsForActiveProfile } from '../refreshWalletAssetsForActiveProfile'
import { getAsyncStatus } from '@core/wallet/utils/generateActivity/helper'

export function setAsyncStatusOfWalletActivities(time: Date): void {
    const balancesToUpdate: string[] = []
    allWalletActivities.update((state) => {
        Object.entries(state).forEach(([walletId, walletActivies]) => {
            for (const activity of walletActivies.filter((_activity) => _activity.asyncData)) {
                const oldAsyncStatus = activity.asyncData.asyncStatus
                if (oldAsyncStatus === ActivityAsyncStatus.Claimed || oldAsyncStatus === ActivityAsyncStatus.Expired) {
                    continue
                }
                activity.asyncData.asyncStatus = getAsyncStatus(
                    false,
                    activity.asyncData.expirationDate,
                    activity.asyncData.timelockDate,
                    !!activity.storageDeposit,
                    time.getTime()
                )
                if (oldAsyncStatus !== null && oldAsyncStatus !== activity.asyncData.asyncStatus) {
                    if (!balancesToUpdate.includes(walletId)) {
                        balancesToUpdate.push(walletId)
                    }

                    if (
                        activity.type === ActivityType.Nft &&
                        activity.asyncData.asyncStatus === ActivityAsyncStatus.Expired &&
                        activity.direction === ActivityDirection.Outgoing
                    ) {
                        updateNftInAllWalletNfts(walletId, activity.nftId, { isSpendable: true })
                    }
                }
            }
        })
        return state
    })
    for (const walletId of balancesToUpdate) {
        syncBalance(walletId, false)
    }
    if (balancesToUpdate.length) {
        void refreshWalletAssetsForActiveProfile()
    }
}
