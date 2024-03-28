import { ActivityAsyncStatus, ActivityType } from '@core/wallet/enums'
import { addClaimedActivity, allWalletActivities } from '@core/wallet/stores'
import { showAppNotification } from '@auxiliary/notification'
import { localize } from '@core/i18n'
import { updateActivityFromPartialActivity } from '@core/wallet/utils/generateActivity/helper'
import { InclusionState } from '@iota/sdk/out/types'

export function updateClaimingTransactionInclusion(
    transactionId: string,
    inclusionState: InclusionState,
    walletId: string
): void {
    allWalletActivities.update((state) => {
        const activity = state[walletId]?.find(
            (_activity) => _activity.asyncData?.claimingTransactionId === transactionId
        )

        if (activity) {
            if (inclusionState === InclusionState.Confirmed) {
                updateActivityFromPartialActivity(activity, {
                    type: ActivityType.Basic,
                    asyncData: {
                        ...activity.asyncData,
                        isClaiming: false,
                        claimedDate: new Date(),
                        asyncStatus: ActivityAsyncStatus.Claimed,
                    },
                })
                addClaimedActivity(walletId, activity?.transactionId, {
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
                updateActivityFromPartialActivity(activity, {
                    type: ActivityType.Basic,
                    asyncData: {
                        ...activity.asyncData,
                        isClaiming: false,
                        claimingTransactionId: undefined,
                        asyncStatus: ActivityAsyncStatus.Unclaimed,
                    },
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
