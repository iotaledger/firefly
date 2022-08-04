import { get } from 'svelte/store'
import { Activity } from '../classes'
import { activityFilter } from '../stores'
import { ActivityAsyncStatus, ActivityDirection, ActivityType, InclusionState } from '../enums'

export function isFilteredActivity(activity: Activity): boolean {
    const filter = get(activityFilter)

    if (!filter.showHidden.active && activity.isAssetHidden) {
        return true
    }
    if (filter.status.active && filter.status.selected) {
        if (
            filter.status.selected === InclusionState.Confirmed &&
            activity.inclusionState !== InclusionState.Confirmed
        ) {
            return true
        }
        if (filter.status.selected === InclusionState.Pending && activity.inclusionState !== InclusionState.Pending) {
            return true
        }
        if (
            filter.status.selected === ActivityAsyncStatus.Claimed &&
            activity.asyncStatus !== ActivityAsyncStatus.Claimed
        ) {
            return true
        }
        if (
            filter.status.selected === ActivityAsyncStatus.Unclaimed &&
            (!activity.asyncStatus || activity.asyncStatus === ActivityAsyncStatus.Claimed)
        ) {
            return true
        }
    }
    if (filter.type.active && filter.type.selected) {
        if (filter.type.selected === ActivityDirection.In && activity.direction !== ActivityDirection.In) {
            return true
        }
        if (filter.type.selected === ActivityDirection.Out && activity.direction !== ActivityDirection.Out) {
            return true
        }
        if (
            filter.type.selected === ActivityType.InternalTransaction &&
            activity.type !== ActivityType.InternalTransaction
        ) {
            return true
        }
    }
    return false
}
