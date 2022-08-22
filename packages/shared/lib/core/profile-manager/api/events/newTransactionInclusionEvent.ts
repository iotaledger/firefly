import { localize } from '@core/i18n'
import { ActivityAsyncStatus } from '@core/wallet'
import { allAccountActivities, updateActivityByTransactionId } from '@core/wallet/stores/all-account-activities.store'
import { showAppNotification } from '@lib/notifications'
import { TransactionInclusionEvent } from '../types/transactionInclusionEvent'

export function handleTransactionInclusionEvent(accountId: string, event: TransactionInclusionEvent): void {
    updateActivityByTransactionId(accountId, event.transactionId, { inclusionState: event.inclusionState })
    allAccountActivities.update((state) => {
        const activity = state[Number(accountId)]?.find(
            (_activity) => _activity.claimingTransactionId === event.transactionId
        )

        if (activity) {
            activity.updateFromPartialActivity({
                isClaimed: true,
                isClaiming: false,
                asyncStatus: ActivityAsyncStatus.Claimed,
            })
            showAppNotification({
                type: 'info',
                message: localize('notifications.claimed.success'),
            })
        }
        return state
    })
}
