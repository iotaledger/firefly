import { get } from 'svelte/store'

import { activeProfileId } from '@core/profile'
import { persistent } from '@core/utils/store'

import type { IHiddenActivities } from '../interfaces'

export const hiddenActivities = persistent<IHiddenActivities>('hiddenActivities', {})

export function isActivityHiddenForWalletId(walletId: string, activityId: string): boolean {
    const activities = get(hiddenActivities)?.[get(activeProfileId)]?.[walletId]
    return activities ? activities.includes(activityId) : false
}

export function removeActivityFromHiddenActivities(walletId: string, activityId: string): void {
    const activities = get(hiddenActivities)?.[get(activeProfileId)]?.[walletId]
    if (activities) {
        hiddenActivities.update((state) => {
            state[get(activeProfileId)][walletId] = activities.filter((id) => id !== activityId)
            return state
        })
    }
}
