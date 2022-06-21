import { writable } from 'svelte/store'
import { Activity } from '../classes'
import { InclusionState } from '../enums'
import { IActivity } from '../interfaces'

export const allAccountActivities = writable<Activity[][]>([])

export function addEmptyAccountActivitiesToAllAccountActivities(accountId: string): void {
    replaceAccountActivitiesInAllAccountActivities(accountId, [])
}

export function addActivityToAccountActivitiesInAllAccountActivities(accountId: string, activity: Activity): void {
    allAccountActivities.update((state) => {
        state[accountId].push(activity)
        return state
    })
}

export function replaceAccountActivitiesInAllAccountActivities(accountId: string, accountActivities: Activity[]): void {
    allAccountActivities.update((state) => {
        state[accountId] = accountActivities
        return state
    })
}

export function updateActivityInclusionStateByTransactionId(
    accountId: string,
    transactionId: string,
    inclusionState: InclusionState
): void {
    updateActivityByTransactionId(accountId, transactionId, { inclusionState })
}

export function updateActivityClaimStateByTransactionId(
    accountId: string,
    transactionId: string,
    isClaimed: boolean = true
): void {
    updateActivityByTransactionId(accountId, transactionId, { isClaimed })
}

export function updateActivityByTransactionId(
    accountId: string,
    transactionId: string,
    partialActivity: Partial<IActivity>
): void {
    allAccountActivities.update((state) => {
        const activity = state[accountId]?.find((_activity) => _activity.id === transactionId)

        if (activity) {
            activity.updateFromPartialActivity(partialActivity)
        }
        return state
    })
}

export function updateActivityByActivityId(
    accountId: string,
    activityId: string,
    partialActivity: Partial<IActivity>
): void {
    allAccountActivities.update((state) => {
        const activity = state[accountId]?.find((_activity) => _activity.id === activityId)

        if (activity) {
            activity.updateFromPartialActivity(partialActivity)
        }
        return state
    })
}
