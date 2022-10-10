import { selectedAccount } from '@core/account'
import { get } from 'svelte/store'
import { updateActivityDataByActivityId } from '../stores'
import { hiddenActivities } from '../stores/hidden-activities.store'
import { localize } from '@core/i18n'
import { showAppNotification } from '@lib/notifications'
import { ActivityType } from '../enums'
import { activeProfileId } from '@core/profile'

export function rejectActivity(id: string): void {
    const accountIndex = get(selectedAccount).index
    hiddenActivities.update((state) => {
        const profileId = get(activeProfileId)
        if (Array.isArray(state)) {
            // needed because of legacy way to store hidden activities
            state = {}
        }
        if (!state[profileId]) {
            state[profileId] = {}
        }
        if (!state[profileId][accountIndex]) {
            state[profileId][accountIndex] = []
        }
        state[profileId][accountIndex].push(id)
        return state
    })

    updateActivityDataByActivityId(accountIndex, id, { type: ActivityType.Transaction, isRejected: true })
    showAppNotification({
        type: 'success',
        alert: true,
        message: localize('notifications.hideActivity.success'),
    })
}
