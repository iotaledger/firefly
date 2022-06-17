import { selectedAccount } from '@core/account/stores/selected-account.store'
import { get } from 'svelte/store'
import { queriedActivities } from '../stores/selected-account-activities.store'

export async function claimActivity(id: string): Promise<void> {
    try {
        const results = await get(selectedAccount).collectOutputs([id])
        if (results.length > 0) {
            queriedActivities.update((state) => {
                const activity = state.find((activity) => activity.id === id)
                activity.isClaimed = true
                activity.claimedTransactionId = results[0].transactionId
                activity.claimedTime = new Date()
                return state
            })
        }
    } catch (err) {
        console.error(err)
    }
}
