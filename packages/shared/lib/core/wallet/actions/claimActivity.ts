import { selectedAccountId } from '@core/account'
import { syncBalance } from '@core/account/actions/syncBalance'
import { selectedAccount } from '@core/account/stores/selected-account.store'
import { BaseError } from '@core/error'
import { localize } from '@core/i18n'
import { showAppNotification } from '@lib/notifications'
import { checkStronghold } from '@lib/stronghold'
import { get } from 'svelte/store'
import { Activity } from '../classes'
import { ActivityAsyncStatus } from '../enums'
import { addClaimedActivity, updateActivityDataByActivityId } from '../stores'

export async function claimActivity(activity: Activity): Promise<void> {
    await checkStronghold()
    const account = get(selectedAccount)
    try {
        const outputId = activity.data.type === 'transaction' ? activity.data.outputId : undefined
        updateActivityDataByActivityId(account.id, activity.id, { type: 'transaction', isClaiming: true })
        const results = await account.claimOutputs([outputId])
        if (results.length > 0) {
            const transactionId = results[0].transactionId
            addClaimedActivity(account.id, activity.transactionId, {
                id: activity.id,
                claimingTransactionId: transactionId,
                claimedTimestamp: new Date().getTime(),
            })
            updateActivityDataByActivityId(account.id, activity.id, {
                type: 'transaction',
                isClaimed: true,
                claimingTransactionId: transactionId,
                asyncStatus: ActivityAsyncStatus.Claimed,
                claimedDate: new Date(),
            })

            syncBalance(get(selectedAccountId))

            showAppNotification({
                type: 'info',
                message: localize('notifications.claimed.success'),
            })
        }
    } catch (err) {
        if (!err.message) {
            new BaseError({
                message: localize('notifications.claimed.error'),
                logToConsole: true,
                showNotification: true,
            })
        }
    } finally {
        updateActivityDataByActivityId(account.id, activity.id, { type: 'transaction', isClaiming: false })
    }
}
