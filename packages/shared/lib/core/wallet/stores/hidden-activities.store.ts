import { persistent } from '@lib/helpers'
import { get } from 'svelte/store'
import type { IHiddenActivities } from '../interfaces'

export const hiddenActivities = persistent<IHiddenActivities[]>('hiddenActivities', [])

export function isActivityHiddenForAccountId(accountId: string, activityId: string): boolean {
    const activities = get(hiddenActivities)[accountId]
    return activities ? activities.includes(activityId) : false
}
