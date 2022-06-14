import { selectedAccount } from '@core/account/stores/selected-account.store'
import { get } from 'svelte/store'
import { queriedActivities } from '../stores/selected-account-activities.store'

export function claimActivity(id: string): void {
    queriedActivities.update((state) => {
        const activity = state.find((activity) => activity.id === id)
        get(selectedAccount).collectOutputs([activity.id])
        activity.isClaimed = true
        return state
    })
}
