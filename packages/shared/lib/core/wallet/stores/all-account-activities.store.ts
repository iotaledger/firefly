import { writable } from 'svelte/store'
import { Activity } from '../classes'
import { IActivity } from '../interfaces'

export const allAccountActivities = writable<Activity[][]>([])

export function addEmptyAccountActivitiesToAllAccountActivities(accountId: string): void {
    setAccountActivitiesInAllAccountActivities(accountId, [])
}

export function addActivityToAccountActivitiesInAllAccountActivities(accountId: string, activity: Activity): void {
    allAccountActivities.update((state) => {
        if (!state[accountId]) {
            state[accountId] = []
        }
        state[accountId].push(activity)
        return state
    })
}

export function setAccountActivitiesInAllAccountActivities(accountId: string, accountActivities: Activity[]): void {
    allAccountActivities.update((state) => {
        state[Number(accountId)] = accountActivities
        return state
    })
}

export function updateActivityByTransactionId(
    accountId: string,
    transactionId: string,
    partialActivity: Partial<IActivity>
): void {
    allAccountActivities.update((state) => {
        const activity = state[Number(accountId)]?.find((_activity) => _activity.transactionId === transactionId)

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
        const activity = state[Number(accountId)]?.find((_activity) => _activity.id === activityId)

        if (activity) {
            activity.updateFromPartialActivity(partialActivity)
        }
        return state
    })
}
