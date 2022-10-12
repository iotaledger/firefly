import { ActivityAsyncStatus, ActivityType, InclusionState } from '@core/wallet/enums'
import { addClaimedActivity, allAccountActivities } from '@core/wallet/stores'
import { showAppNotification } from '@lib/notifications'
import { localize } from '@core/i18n'

export function updateClaimingTransactionInclusion(
    transactionId: string,
    inclusionState: InclusionState,
    accountIndex: number
): void {
    allAccountActivities.update((state) => {
        const activity = state[accountIndex]?.find(
            (_activity) =>
                _activity.data.type === ActivityType.Transaction &&
                _activity.data.claimingTransactionId === transactionId
        )

        if (activity) {
            if (inclusionState === InclusionState.Confirmed) {
                activity.updateDataFromPartialActivity({
                    type: ActivityType.Transaction,
                    isClaimed: true,
                    isClaiming: false,
                    claimedDate: new Date(),
                    asyncStatus: ActivityAsyncStatus.Claimed,
                })
                addClaimedActivity(accountIndex, activity.transactionId, {
                    id: activity.id,
                    claimingTransactionId: transactionId,
                    claimedTimestamp: new Date().getTime(),
                })

                showAppNotification({
                    type: 'success',
                    alert: true,
                    message: localize('notifications.claimed.success'),
                })
            } else if (inclusionState === InclusionState.Conflicting) {
                activity.updateDataFromPartialActivity({
                    type: ActivityType.Transaction,
                    isClaimed: false,
                    isClaiming: false,
                    claimingTransactionId: undefined,
                    asyncStatus: ActivityAsyncStatus.Unclaimed,
                })
                showAppNotification({
                    type: 'error',
                    alert: true,
                    message: localize('notifications.claimed.error'),
                })
            }
        }
        return state
    })
}
