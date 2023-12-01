import { get, writable } from 'svelte/store'
import { Activity, AsyncData, BaseActivity } from '../types'

// TODO(2.0) Rename file

export const allWalletActivities = writable<Record<string, Activity[]>>({})

export function addEmptyWalletActivitiesToAllWalletActivities(walletId: string): void {
    setWalletActivitiesInAllWalletActivities(walletId, [])
}

export function addActivityToWalletActivitiesInAllWalletActivities(walletId: string, activity: Activity): void {
    allWalletActivities.update((state) => {
        if (!state[walletId]) {
            state[walletId] = []
        }
        state[walletId].push(activity)
        return state
    })
}

export function addActivitiesToWalletActivitiesInAllWalletActivities(
    walletId: string,
    activities: Activity[]
): void {
    allWalletActivities.update((state) => {
        if (!state[walletId]) {
            state[walletId] = []
        }
        state[walletId].push(...activities)
        return state
    })
}

export function setWalletActivitiesInAllWalletActivities(walletId: string, walletActivities: Activity[]): void {
    allWalletActivities.update((state) => {
        state[walletId] = walletActivities
        return state
    })
}

export function getActivityByTransactionId(walletId: string, transactionId: string): Activity | undefined {
    return get(allWalletActivities)?.[walletId]?.find((_activity) => _activity?.transactionId === transactionId)
}

export function updateActivityByTransactionId(
    walletId: string,
    transactionId: string,
    partialBaseActivity: Partial<BaseActivity>
): void {
    allWalletActivities.update((state) => {
        const activities = state[walletId]?.filter((_activity) => _activity?.transactionId === transactionId)

        activities.forEach((activity) => Object.assign(activity, partialBaseActivity))
        return state
    })
}

export function updateActivityByActivityId(
    walletId: string,
    activityId: string,
    partialBaseActivity: Partial<BaseActivity>
): void {
    allWalletActivities.update((state) => {
        const activity = state[walletId]?.find((_activity) => _activity.id === activityId)

        if (activity) {
            Object.assign(activity, partialBaseActivity)
        }
        return state
    })
}

export function updateAsyncDataByActivityId(
    walletId: string,
    activityId: string,
    partialAsyncData: Partial<AsyncData>
): void {
    allWalletActivities.update((state) => {
        const activity = state[walletId]?.find((_activity) => _activity.id === activityId)

        if (activity) {
            Object.assign(activity, { asyncData: { ...activity.asyncData, ...partialAsyncData } })
        }
        return state
    })
}

export function updateAsyncDataByTransactionId(
    walletId: string,
    transactionId: string,
    partialAsyncData: Partial<AsyncData>
): void {
    allWalletActivities.update((state) => {
        const activity = state[walletId]?.find((_activity) => _activity?.transactionId === transactionId)

        if (activity) {
            Object.assign(activity, { asyncData: { ...activity.asyncData, ...partialAsyncData } })
        }
        return state
    })
}
