import { selectedAccount } from '@core/account/stores/selected-account.store'
import { get } from 'svelte/store'
import { updateActivity } from '../stores'
import { queriedActivities } from '../stores/selected-account-activities.store'

export async function claimActivity(id: string): Promise<void> {
    try {
        const results = await get(selectedAccount).collectOutputs([id])
        if (results.length > 0) {
            updateActivity({ isClaimed: true, claimedTransactionId: results[0].transactionId, claimedDate: new Date() })
        }
    } catch (err) {
        console.error(err)
    }
}
