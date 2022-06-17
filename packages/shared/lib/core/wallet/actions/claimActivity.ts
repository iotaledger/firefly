import { selectedAccount } from '@core/account/stores/selected-account.store'
import { get } from 'svelte/store'
import { Activity } from '../classes'
import { addClaimedActivity, updateActivity } from '../stores'

export async function claimActivity(activity: Activity): Promise<void> {
    try {
        const results = await get(selectedAccount).collectOutputs([activity.id])
        if (results.length > 0) {
            addClaimedActivity(get(selectedAccount).id, activity.transactionId, {
                id: activity.id,
                isClaimed: true,
                claimingTransactionId: results[0].transactionId,
                claimedTimestamp: new Date().getTime(),
            })
            updateActivity({
                id: activity.id,
                isClaimed: true,
                claimingTransactionId: results[0].transactionId,
                claimedDate: new Date(),
            })
        }
    } catch (err) {
        console.error(err)
    }
}
