import { persistent } from '@lib/helpers'
import { get } from 'svelte/store'
import { IHiddenActivities } from '../interfaces'

export const hiddenActivities = persistent<IHiddenActivities[]>('hiddenActivities', [])

export function isActivityHiddenForAccountIndex(accountIndex: number, activityId: string): boolean {
    const { activities } = get(hiddenActivities)[accountIndex]
    return activities ? activities.includes(activityId) : false
}
