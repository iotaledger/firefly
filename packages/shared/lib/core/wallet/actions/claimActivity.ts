import { selectedAccount } from '@core/account/stores/selected-account.store'
import { get } from 'svelte/store'
import { queriedActivities } from '../stores/selected-account-activities.store'

export async function claimActivity(id: string): Promise<void> {
    try {
        await get(selectedAccount).collectOutputs([id])
        queriedActivities.update((state) => {
            const activity = state.find((activity) => activity.id === id)
            activity.isClaimed = true
            return state
        })
    } catch (err) {
        console.error(err)
    }
}
