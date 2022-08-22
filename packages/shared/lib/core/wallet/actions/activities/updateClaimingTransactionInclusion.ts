import { ActivityAsyncStatus, InclusionState } from '@core/wallet/enums'
import { addClaimedActivity, allAccountActivities } from '@core/wallet/stores'
import { showAppNotification } from '@lib/notifications'
import { localize } from '@core/i18n'

export function updateClaimingTransactionInclusion(
    transactionId: string,
    inclusionState: InclusionState,
    accountId: string
): void {
    allAccountActivities.update((state) => {
        const activity = state[Number(accountId)]?.find(
            (_activity) => _activity.claimingTransactionId === transactionId
        )

        if (activity) {
            if (inclusionState === InclusionState.Confirmed) {
                activity.updateFromPartialActivity({
                    isClaimed: true,
                    isClaiming: false,
                    asyncStatus: ActivityAsyncStatus.Claimed,
                })
                addClaimedActivity(accountId, activity.transactionId, {
                    id: activity.id,
                    claimingTransactionId: transactionId,
                    claimedTimestamp: new Date().getTime(),
                })

                showAppNotification({
                    type: 'info',
                    alert: true,
                    message: localize('notifications.claimed.success'),
                })
            } else if (inclusionState === InclusionState.Conflicting) {
                activity.updateFromPartialActivity({
                    isClaimed: false,
                    isClaiming: false,
                    asyncStatus: ActivityAsyncStatus.Unclaimed,
                })
                showAppNotification({
                    type: 'info',
                    alert: true,
                    message: localize('notifications.claimed.error'),
                })
            }
        }
        return state
    })
}
