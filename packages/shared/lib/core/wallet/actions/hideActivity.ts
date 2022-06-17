import { selectedAccount } from '@core/account'
import { get } from 'svelte/store'
import { queriedActivities, updateActivity } from '../stores'
import { hiddenActivities } from '../stores/hidden-activities.store'

export function hideActivity(id: string): void {
    hiddenActivities.update((state) => {
        if (!state[get(selectedAccount).id] || !Array.isArray(state[get(selectedAccount).id])) {
            state[get(selectedAccount).id] = []
        }
        state[get(selectedAccount).id].push(id)
        return state
    })

    updateActivity({ id, isHidden: true })
}
