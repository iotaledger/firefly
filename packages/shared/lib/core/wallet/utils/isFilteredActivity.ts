import { get } from 'svelte/store'
import { Activity } from '../classes'
import { ActivityAsyncStatus, InclusionState } from '../enums'
import { activityFilter } from '../stores'

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
    return false
}
