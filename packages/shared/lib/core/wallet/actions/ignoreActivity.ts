import { get } from 'svelte/store'
import { selectedWalletId, updateAsyncDataByActivityId } from '../stores'
import { hiddenActivities } from '../stores/hidden-activities.store'
import { localize } from '@core/i18n'
import { showAppNotification } from '@auxiliary/notification'
import { activeProfileId } from '@core/profile'

export function ignoreActivity(id: string): void {
    const walletId = get(selectedWalletId)
    hiddenActivities.update((state) => {
        const profileId = get(activeProfileId)
        if (Array.isArray(state)) {
            // needed because of legacy way to store hidden activities
            state = {}
        }
        if (!state[profileId]) {
            state[profileId] = {}
        }
        if (!state[profileId][walletId]) {
            state[profileId][walletId] = []
        }
        state[profileId][walletId].push(id)
        return state
    })

    updateAsyncDataByActivityId(walletId, id, { isIgnored: true })
    showAppNotification({
        type: 'success',
        alert: true,
        message: localize('notifications.hideActivity.success'),
    })
}
