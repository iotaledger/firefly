import { syncBalance } from '@core/account/actions/syncBalance'
import { selectedAccountId } from '@core/account/stores/selected-account-id.store'
import { selectedAccount } from '@core/account/stores/selected-account.store'
import { BaseError } from '@core/error'
import { localize } from '@core/i18n'
import { showAppNotification } from '@lib/notifications'
import { checkStronghold } from '@lib/stronghold'
import { get } from 'svelte/store'
import { Activity } from '../classes'
import { addClaimedActivity, updateActivityByActivityId } from '../stores'

export async function claimActivity(activity: Activity): Promise<void> {
    await checkStronghold()
    const account = get(selectedAccount)
    try {
        updateActivityByActivityId(account.id, activity.id, { isClaiming: true })
        const results = await account.claimOutputs([activity.outputId])
        if (results.length > 0) {
            const transactionId = results[0].transactionId
            addClaimedActivity(account.id, activity.transactionId, {
                id: activity.id,
                claimingTransactionId: transactionId,
                claimedTimestamp: new Date().getTime(),
            })
            updateActivityByActivityId(account.id, activity.id, {
                isClaimed: true,
                claimingTransactionId: transactionId,
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
            new BaseError({ message: localize('notifications.claimed.error'), logError: true, showNotification: true })
        }
    } finally {
        updateActivityByActivityId(account.id, activity.id, { isClaiming: false })
    }
}
