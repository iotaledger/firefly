import { selectedAccount } from '@core/account'
import { get } from 'svelte/store'
import { updateActivity } from '../stores'
import { hiddenActivities } from '../stores/hidden-activities.store'
import { localize } from '@core/i18n'
import { showAppNotification } from '@lib/notifications'

export function hideActivity(id: string): void {
    try {
        const accountId = get(selectedAccount).id
        hiddenActivities.update((state) => {
            if (!state[accountId] || !Array.isArray(state[accountId])) {
                state[accountId] = []
            }
            state[accountId].push(id)
            return state
        })

        updateActivity(accountId, { id, isHidden: true })

        showAppNotification({
            type: 'info',
            message: localize('general.rejectSuccess'),
        })
    } catch (err) {
        console.error(err)
        showAppNotification({
            type: 'error',
            message: localize('general.rejectFailed'),
        })
    }
}
