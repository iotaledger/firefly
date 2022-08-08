import { selectedAccount } from '@core/account'
import { get } from 'svelte/store'
import { updateActivityByActivityId } from '../stores'
import { hiddenActivities } from '../stores/hidden-activities.store'
import { localize } from '@core/i18n'
import { showAppNotification } from '@lib/notifications'

export function rejectActivity(id: string): void {
    try {
        const accountId = get(selectedAccount).id
        hiddenActivities.update((state) => {
            if (!state[accountId] || !Array.isArray(state[accountId])) {
                state[accountId] = []
            }
            state[accountId].push(id)
            return state
        })

        updateActivityByActivityId(accountId, id, { isRejected: true })

        showAppNotification({
            type: 'info',
            message: localize('notifications.hideActivity.success'),
        })
    } catch (err) {
        console.error(err)
        showAppNotification({
            type: 'error',
            message: localize('notifications.hideActivity.error'),
        })
    }
}
