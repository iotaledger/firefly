import { persistent } from '@lib/helpers'
import { get } from 'svelte/store'
import { IHiddenActivities } from '../interfaces'

export const hiddenActivities = persistent<IHiddenActivities[]>('hiddenActivities', [])

export function isActivityHiddenForAccountId(accountId: string, activityId: string): boolean {
    return get(hiddenActivities)[accountId].includes(activityId)
}
