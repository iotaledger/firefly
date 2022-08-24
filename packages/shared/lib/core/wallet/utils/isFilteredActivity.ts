import { parseCurrency } from '@lib/currency'
import { get } from 'svelte/store'
import { Activity } from '../classes'
import { activityFilter } from '../stores'
import { getAssetFromPersistedAssets } from './getAssetFromPersistedAssets'
import {
    ActivityAsyncStatus,
    ActivityDirection,
    BooleanFilterOption,
    NumberFilterOption,
    InclusionState,
    TypeFilterOption,
    StatusFilterOption,
    ActivityType,
} from '../enums'

export function isFilteredActivity(activity: Activity): boolean {
    const filter = get(activityFilter)

    if (
        (!filter.showHidden.active || filter.showHidden.selected === BooleanFilterOption.No) &&
        activity.isAssetHidden
    ) {
        return true
    }
    if (
        (!filter.showRejected.active || filter.showRejected.selected === BooleanFilterOption.No) &&
        activity.data.type === ActivityType.Transaction &&
        activity.data.isRejected
    ) {
        return true
    }
    if (filter.asset.active && filter.asset.selected) {
        if (filter.asset.selected && activity.data.assetId !== filter.asset.selected) {
            return true
        }
    }
    if (filter.amount.active) {
        const activityAmount =
            activity.data.rawAmount / 10 ** getAssetFromPersistedAssets(activity.data.assetId).metadata.decimals
        if (filter.amount.selected === NumberFilterOption.Equal && filter.amount.subunit.type === 'single') {
            const isEqual = activityAmount === parseCurrency(filter.amount.subunit.amount)
            if (!isEqual) {
                return true
            }
        }
        if (filter.amount.selected === NumberFilterOption.Range && filter.amount.subunit.type === 'range') {
            const isInRange =
                activityAmount <= parseCurrency(filter.amount.subunit.end) &&
                activityAmount >= parseCurrency(filter.amount.subunit.start)
            if (!isInRange) {
                return true
            }
        }
        if (filter.amount.selected === NumberFilterOption.Greater && filter.amount.subunit.type === 'single') {
            const isGreater = activityAmount >= parseCurrency(filter.amount.subunit.amount)
            if (!isGreater) {
                return true
            }
        }
        if (filter.amount.selected === NumberFilterOption.Less && filter.amount.subunit.type === 'single') {
            const isLess = activityAmount <= parseCurrency(filter.amount.subunit.amount)
            if (!isLess) {
                return true
            }
        }
    }
    if (filter.status.active && filter.status.selected) {
        if (
            filter.status.selected === StatusFilterOption.Confirmed &&
            activity.inclusionState !== InclusionState.Confirmed
        ) {
            return true
        }
        if (
            filter.status.selected === StatusFilterOption.Pending &&
            activity.inclusionState !== InclusionState.Pending
        ) {
            return true
        }
        if (
            filter.status.selected === StatusFilterOption.Claimed &&
            activity.data.type === ActivityType.Transaction &&
            activity.data.asyncStatus !== ActivityAsyncStatus.Claimed
        ) {
            return true
        }
        if (
            filter.status.selected === StatusFilterOption.Unclaimed &&
            activity.data.type === ActivityType.Transaction &&
            (!activity.data.asyncStatus || activity.data.asyncStatus === ActivityAsyncStatus.Claimed)
        ) {
            return true
        }
    }
    if (filter.type.active && filter.type.selected) {
        if (
            filter.type.selected === TypeFilterOption.Incoming &&
            activity.data.type === ActivityType.Transaction &&
            activity.data.direction !== ActivityDirection.In
        ) {
            return true
        }
        if (
            filter.type.selected === TypeFilterOption.Outgoing &&
            activity.data.type === ActivityType.Transaction &&
            activity.data.direction !== ActivityDirection.Out
        ) {
            return true
        }
        if (
            filter.type.selected === TypeFilterOption.Internal &&
            activity.data.type === ActivityType.Transaction &&
            !activity.data.isInternal
        ) {
            return true
        }
    }
    return false
}
