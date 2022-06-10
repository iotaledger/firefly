import { selectedAccount } from '@core/account'
import { get } from 'svelte/store'
import { queriedActivities } from '../stores'

export function claimActivity(id: string): void {
    queriedActivities.update((state) => {
        const activity = state.find((activity) => activity.id === id)
        get(selectedAccount).collectOutputs([activity.id])
        activity.isClaimed = true
        return state
    })
}
