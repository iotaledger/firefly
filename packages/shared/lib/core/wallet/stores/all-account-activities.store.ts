import { writable } from 'svelte/store'
import { Activity, AsyncData, BaseActivity } from '../types'

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
    partialBaseActivity: Partial<BaseActivity>
): void {
    allAccountActivities.update((state) => {
        const activity = state[accountIndex]?.find((_activity) => _activity.transactionId === transactionId)

        if (activity) {
            Object.assign(activity, partialBaseActivity)
        }
        return state
    })
}

export function updateActivityByActivityId(
    accountIndex: number,
    activityId: string,
    partialBaseActivity: Partial<BaseActivity>
): void {
    allAccountActivities.update((state) => {
        const activity = state[accountIndex]?.find((_activity) => _activity.id === activityId)

        if (activity) {
            Object.assign(activity, partialBaseActivity)
        }
        return state
    })
}

export function updateAsyncDataByActivityId(
    accountIndex: number,
    activityId: string,
    partialAsyncData: Partial<AsyncData>
): void {
    allAccountActivities.update((state) => {
        const activity = state[accountIndex]?.find((_activity) => _activity.id === activityId)

        if (activity) {
            Object.assign(activity, { asyncData: { ...activity.asyncData, ...partialAsyncData } })
        }
        return state
    })
}

export function updateAsyncDataByTransactionId(
    accountIndex: number,
    transactionId: string,
    partialAsyncData: Partial<AsyncData>
): void {
    allAccountActivities.update((state) => {
        const activity = state[accountIndex]?.find((_activity) => _activity.transactionId === transactionId)

        if (activity) {
            Object.assign(activity, { asyncData: { ...activity.asyncData, ...partialAsyncData } })
        }
        return state
    })
}
