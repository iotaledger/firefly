import { selectedAccount } from '@core/account'
import { get } from 'svelte/store'
import { updateActivityDataByActivityId } from '../stores'
import { hiddenActivities } from '../stores/hidden-activities.store'
import { localize } from '@core/i18n'
import { showAppNotification } from '@lib/notifications'
import { ActivityType } from '../enums'

export function rejectActivity(id: string): void {
    const accountIndex = get(selectedAccount).index
    hiddenActivities.update((state) => {
        if (!state[accountIndex] || !Array.isArray(state[accountIndex].activities)) {
            state[accountIndex].activities = []
        }
        state[accountIndex].activities.push(id)
        return state
    })

    updateActivityDataByActivityId(accountIndex, id, { type: ActivityType.Transaction, isRejected: true })
    showAppNotification({
        type: 'success',
        alert: true,
        message: localize('notifications.hideActivity.success'),
    })
}
