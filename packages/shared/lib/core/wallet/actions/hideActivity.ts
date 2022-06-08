import { selectedAccount } from '@core/account'
import { get } from 'svelte/store'
import { queriedActivities } from '../stores'
import { hiddenActivities } from '../stores/hidden-activities.store'

export function hideActivity(id: string): void {
    hiddenActivities.update((state) => {
        if (!state[get(selectedAccount).id]) {
            state[get(selectedAccount).id] = []
        }
        state[get(selectedAccount).id].push(id)
        return state
    })

    queriedActivities.update((state) => {
        const activity = state.find((activity) => activity.id === id)
        activity.isHidden = true
        return state
    })
}
