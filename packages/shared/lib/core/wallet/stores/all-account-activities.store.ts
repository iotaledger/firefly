import { writable } from 'svelte/store'
import { Activity } from '../classes'
import { IActivity, IPartialFoundryActivityDataWithType, IPartialTransactionActivityDataWithType } from '../interfaces'

export const allAccountActivities = writable<Activity[][]>([])

export function addEmptyAccountActivitiesToAllAccountActivities(accountIndex: number): void {
    setAccountActivitiesInAllAccountActivities(accountIndex, [])
}

export function addActivityToAccountActivitiesInAllAccountActivities(accountIndex: number, activity: Activity): void {
    allAccountActivities.update((state) => {
        if (!state[accountIndex]) {
            state[accountIndex] = []
        }
        state[accountIndex].push(activity)
        return state
    })
}

export function setAccountActivitiesInAllAccountActivities(accountIndex: number, accountActivities: Activity[]): void {
    allAccountActivities.update((state) => {
        state[accountIndex] = accountActivities
        return state
    })
}

export function updateActivityByTransactionId(
    accountIndex: number,
    transactionId: string,
    partialActivity: Partial<IActivity>
): void {
    allAccountActivities.update((state) => {
        const activity = state[accountIndex]?.find((_activity) => _activity.transactionId === transactionId)

        if (activity) {
            activity.updateFromPartialActivity(partialActivity)
        }
        return state
    })
}

export function updateActivityByActivityId(
    accountIndex: number,
    activityId: string,
    partialActivity: Partial<IActivity>
): void {
    allAccountActivities.update((state) => {
        const activity = state[accountIndex]?.find((_activity) => _activity.id === activityId)

        if (activity) {
            activity.updateFromPartialActivity(partialActivity)
        }
        return state
    })
}

export function updateActivityDataByActivityId(
    accountIndex: number,
    activityId: string,
    partialData: IPartialTransactionActivityDataWithType | IPartialFoundryActivityDataWithType
): void {
    allAccountActivities.update((state) => {
        const activity = state[accountIndex]?.find((_activity) => _activity.id === activityId)

        if (activity) {
            activity.updateDataFromPartialActivity(partialData)
        }
        return state
    })
}

export function updateActivityDataByTransactionId(
    accountIndex: number,
    transactionId: string,
    partialData: IPartialTransactionActivityDataWithType | IPartialFoundryActivityDataWithType
): void {
    allAccountActivities.update((state) => {
        const activity = state[accountIndex]?.find((_activity) => _activity.transactionId === transactionId)

        if (activity) {
            activity.updateDataFromPartialActivity(partialData)
        }
        return state
    })
}
