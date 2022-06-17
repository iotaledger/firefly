import { selectedAccount } from '@core/account/stores/selected-account.store'
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
        }
    } catch (err) {
        console.error(err)
    } finally {
        updateActivity(account.id, { id: activity.id, isClaiming: false })
    }
}
