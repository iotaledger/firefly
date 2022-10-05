import { selectedAccount } from '@core/account'
import { get } from 'svelte/store'
import { updateActivityDataByActivityId } from '../stores'
import { hiddenActivities } from '../stores/hidden-activities.store'
import { localize } from '@core/i18n'
import { showAppNotification } from '@lib/notifications'
import { ActivityType } from '../enums'

export function rejectActivity(id: string): void {
    const accountId = get(selectedAccount).id
    hiddenActivities.update((state) => {
        if (!state[accountId] || !Array.isArray(state[accountId])) {
            state[accountId] = []
        }
        state[accountId].push(id)
        return state
    })

    updateActivityDataByActivityId(accountId, id, { type: ActivityType.Transaction, isRejected: true })
    showAppNotification({
        type: 'success',
        alert: true,
        message: localize('notifications.hideActivity.success'),
    })
}
