import { selectedAccount } from '@core/account/stores/selected-account.store'
import { localize } from '@core/i18n'
import { showAppNotification } from '@lib/notifications'
import { get } from 'svelte/store'
import { Activity } from '../classes'
import { addClaimedActivity, updateActivity } from '../stores'

export async function claimActivity(activity: Activity): Promise<void> {
    const account = get(selectedAccount)
    try {
        updateActivity(account.id, { id: activity.id, isClaiming: true })
        const results = await account.collectOutputs([activity.id])
        if (results.length > 0) {
            addClaimedActivity(account.id, activity.transactionId, {
                id: activity.id,
                isClaimed: true,
                claimingTransactionId: results[0].transactionId,
                claimedTimestamp: new Date().getTime(),
            })
            updateActivity(account.id, {
                id: activity.id,
                isClaimed: true,
                claimingTransactionId: results[0].transactionId,
                claimedDate: new Date(),
            })

            showAppNotification({
                type: 'info',
                message: localize('general.claimedSuccess'),
            })
        }
    } catch (err) {
        console.error(err)
        showAppNotification({
            type: 'error',
            message: localize('general.claimedFailed'),
        })
    } finally {
        updateActivity(account.id, { id: activity.id, isClaiming: false })
    }
}
