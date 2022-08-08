import { parseCurrency } from '@lib/currency'
import { get } from 'svelte/store'
import { Activity } from '../classes'
import { BooleanFilterOptions, NumberFilterType } from '../interfaces'
import { activityFilter } from '../stores'
import { getAssetFromPersistedAssets } from './getAssetFromPersistedAssets'
import { ActivityAsyncStatus, ActivityDirection, ActivityType, InclusionState } from '../enums'

export function isFilteredActivity(activity: Activity): boolean {
    const filter = get(activityFilter)

    if (filter.showHidden.active && filter.showHidden.selected === BooleanFilterOptions.No && activity.isAssetHidden) {
        return true
    }
    if (filter.amount.active) {
        const activityAmount =
            activity.rawAmount / 10 ** getAssetFromPersistedAssets(activity.assetId).metadata.decimals
        if (filter.amount.selected === NumberFilterType.Equal && filter.amount.subunit.type === 'single') {
            const isEqual = activityAmount === parseCurrency(filter.amount.subunit.amount)
            if (!isEqual) {
                return true
            }
        }
        if (filter.amount.selected === NumberFilterType.Range && filter.amount.subunit.type === 'range') {
            const isInRange =
                activityAmount <= parseCurrency(filter.amount.subunit.end) &&
                activityAmount >= parseCurrency(filter.amount.subunit.start)
            if (!isInRange) {
                return true
            }
        }
        if (filter.amount.selected === NumberFilterType.Greater && filter.amount.subunit.type === 'single') {
            const isGreater = activityAmount >= parseCurrency(filter.amount.subunit.amount)
            if (!isGreater) {
                return true
            }
        }
        if (filter.amount.selected === NumberFilterType.Less && filter.amount.subunit.type === 'single') {
            const isLess = activityAmount <= parseCurrency(filter.amount.subunit.amount)
            if (!isLess) {
                return true
            }
        }
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
