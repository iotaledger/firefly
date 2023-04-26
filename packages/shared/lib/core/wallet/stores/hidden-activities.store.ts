import { get } from 'svelte/store'

import { activeProfileId } from '@core/profile'
import { persistent } from '@core/utils/store'

import type { IHiddenActivities } from '../interfaces'

export const hiddenActivities = persistent<IHiddenActivities>('hiddenActivities', {})

export function isActivityHiddenForAccountIndex(accountIndex: number, activityId: string): boolean {
    const activities = get(hiddenActivities)?.[get(activeProfileId)]?.[accountIndex]
    return activities ? activities.includes(activityId) : false
}

export function removeActivityFromHiddenActivities(accountIndex: number, activityId: string): void {
    const activities = get(hiddenActivities)?.[get(activeProfileId)]?.[accountIndex]
    if (activities) {
        hiddenActivities.update((state) => {
            state[get(activeProfileId)][accountIndex] = activities.filter((id) => id !== activityId)
            return state
        })
    }
}
