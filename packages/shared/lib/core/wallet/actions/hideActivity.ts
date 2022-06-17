import { selectedAccount } from '@core/account'
import { get } from 'svelte/store'
import { updateActivity } from '../stores'
import { hiddenActivities } from '../stores/hidden-activities.store'

export function hideActivity(id: string): void {
    const accountId = get(selectedAccount).id
    hiddenActivities.update((state) => {
        if (!state[accountId] || !Array.isArray(state[accountId])) {
            state[accountId] = []
        }
        state[accountId].push(id)
        return state
    })

    updateActivity(accountId, { id, isHidden: true })
}
