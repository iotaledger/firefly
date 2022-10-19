import { get } from 'svelte/store'
import { Activity } from '../types'
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
    DateFilterOption,
    DateUnit,
} from '../enums'
import { dateIsAfterOtherDate, dateIsBeforeOtherDate, datesOnSameDay } from '@lib/utils/dateUtils'
import { ActivityFilter } from '../interfaces'
import { convertToRawAmount } from '.'
import Big from 'big.js'

// Filters activities based on activity properties. If none of the conditionals are valid, then activity is shown.
export function isVisibleActivity(activity: Activity): boolean {
    const filter = get(activityFilter)

    if (!isVisibleWithActiveValuelessFilter(activity, filter)) {
        return false
    }
    if (!isVisibleWithActiveHiddenFilter(activity, filter)) {
        return false
    }
    if (!isVisibleWithActiveRejectedFilter(activity, filter)) {
        return false
    }
    if (!isVisibleWithActiveAssetFilter(activity, filter)) {
        return false
    }
    if (!isVisibleWithActiveAmountFilter(activity, filter)) {
        return false
    }
    if (!isVisibleWithActiveDateFilter(activity, filter)) {
        return false
    }
    if (!isVisibleWithActiveStatusFilter(activity, filter)) {
        return false
    }
    if (!isVisibleWithActiveTypeFilter(activity, filter)) {
        return false
    }
    return true
}

function isVisibleWithActiveHiddenFilter(activity: Activity, filter: ActivityFilter): boolean {
    if (
        (!filter.showHidden.active || filter.showHidden.selected === BooleanFilterOption.No) &&
        activity.isAssetHidden
    ) {
        return false
    }
    return true
}

function isVisibleWithActiveValuelessFilter(activity: Activity, filter: ActivityFilter): boolean {
    if (
        (!filter.showValueless.active || filter.showValueless.selected === BooleanFilterOption.No) &&
        (!filter.showHidden.active || filter.showHidden.selected === BooleanFilterOption.No) &&
        !activity.containsValue
    ) {
        return false
    }
    return true
}

function isVisibleWithActiveRejectedFilter(activity: Activity, filter: ActivityFilter): boolean {
    if (
        (!filter.showRejected.active || filter.showRejected.selected === BooleanFilterOption.No) &&
        activity.type === ActivityType.Transaction &&
        activity.isRejected
    ) {
        return false
    }
    return true
}

function isVisibleWithActiveAssetFilter(activity: Activity, filter: ActivityFilter): boolean {
    if (filter.asset.active && filter.asset.selected && activity.type !== ActivityType.Nft) {
        if (filter.asset.selected && activity.assetId !== filter.asset.selected) {
            return false
        }
    }
    return true
}

function isVisibleWithActiveAmountFilter(activity: Activity, filter: ActivityFilter): boolean {
    if (filter.amount.active && activity.type !== ActivityType.Alias && activity.type !== ActivityType.Nft) {
        const asset = getAssetFromPersistedAssets(activity.assetId)
        const activityAmount = Big(activity.rawAmount)

        if (
            filter.amount.selected === NumberFilterOption.Equal &&
            filter.amount.subunit.type === 'single' &&
            filter.amount.subunit.amount
        ) {
            const amount = convertToRawAmount(
                String(filter.amount.subunit.amount),
                asset?.metadata?.unit,
                asset?.metadata
            )
            const isEqual = activityAmount.eq(amount)
            if (!isEqual) {
                return false
            }
        }
        if (
            filter.amount.selected === NumberFilterOption.Range &&
            filter.amount.subunit.type === 'range' &&
            filter.amount.subunit.start &&
            filter.amount.subunit.end
        ) {
            const startAmount = convertToRawAmount(
                String(filter.amount.subunit.start),
                asset?.metadata?.unit,
                asset?.metadata
            )
            const endAmount = convertToRawAmount(
                String(filter.amount.subunit.end),
                asset?.metadata?.unit,
                asset?.metadata
            )
            const isInRange = activityAmount.lte(endAmount) && activityAmount.gte(startAmount)
            if (!isInRange) {
                return false
            }
        }
        if (
            filter.amount.selected === NumberFilterOption.Greater &&
            filter.amount.subunit.type === 'single' &&
            filter.amount.subunit.amount
        ) {
            const amount = convertToRawAmount(
                String(filter.amount.subunit.amount),
                asset?.metadata?.unit,
                asset?.metadata
            )
            const isGreater = activityAmount.gte(amount)
            if (!isGreater) {
                return false
            }
        }
        if (
            filter.amount.selected === NumberFilterOption.Less &&
            filter.amount.subunit.type === 'single' &&
            filter.amount.subunit.amount
        ) {
            const amount = convertToRawAmount(
                String(filter.amount.subunit.amount),
                asset?.metadata?.unit,
                asset?.metadata
            )
            const isLess = activityAmount.lte(amount)
            if (!isLess) {
                return false
            }
        }
    }
    return true
}

function isVisibleWithActiveDateFilter(activity: Activity, filter: ActivityFilter): boolean {
    if (filter.date.active) {
        if (filter.date.selected === DateFilterOption.Equals && filter.date.subunit.type === 'single') {
            const filterDate = new Date(filter.date.subunit.value)
            if (!datesOnSameDay(activity.time, filterDate)) {
                return false
            }
        }
        if (filter.date.selected === DateFilterOption.Before && filter.date.subunit.type === 'single') {
            const filterDate = new Date(filter.date.subunit.value)
            if (!dateIsBeforeOtherDate(activity.time, filterDate)) {
                return false
            }
        }
        if (filter.date.selected === DateFilterOption.After && filter.date.subunit.type === 'single') {
            const filterDate = new Date(filter.date.subunit.value)
            if (!dateIsAfterOtherDate(activity.time, filterDate)) {
                return false
            }
        }
        if (filter.date.selected === DateFilterOption.AfterOrEquals && filter.date.subunit.type === 'single') {
            const filterDate = new Date(filter.date.subunit.value)
            if (!(dateIsAfterOtherDate(activity.time, filterDate) || datesOnSameDay(activity.time, filterDate))) {
                return false
            }
        }
        if (filter.date.selected === DateFilterOption.Range && filter.date.subunit.type === 'range') {
            const startFilterDate = new Date(filter.date.subunit.start)
            const endFilterDate = new Date(filter.date.subunit.end)

            const isInRange =
                dateIsAfterOtherDate(activity.time, startFilterDate) &&
                dateIsBeforeOtherDate(activity.time, endFilterDate)
            const isOnBoundries =
                datesOnSameDay(activity.time, startFilterDate) || datesOnSameDay(activity.time, endFilterDate)
            if (!(isInRange || isOnBoundries)) {
                return false
            }
        }
        if (filter.date.selected === DateFilterOption.Last && filter.date.subunit.type === 'unit') {
            const startFilterDate = new Date()
            const endFilterDate = new Date()
            switch (filter.date.subunit.unit) {
                case DateUnit.Days:
                    startFilterDate.setDate(startFilterDate.getDate() - Number(filter.date.subunit.amount))
                    break
                case DateUnit.Months:
                    startFilterDate.setMonth(startFilterDate.getMonth() - Number(filter.date.subunit.amount))
                    break
                case DateUnit.Years:
                    startFilterDate.setFullYear(startFilterDate.getFullYear() - Number(filter.date.subunit.amount))
                    break
            }

            const isInRange =
                dateIsAfterOtherDate(activity.time, startFilterDate) &&
                dateIsBeforeOtherDate(activity.time, endFilterDate)
            const isOnBoundries =
                datesOnSameDay(activity.time, startFilterDate) || datesOnSameDay(activity.time, endFilterDate)
            if (!(isInRange || isOnBoundries)) {
                return false
            }
        }
    }
    return true
}

function isVisibleWithActiveStatusFilter(activity: Activity, filter: ActivityFilter): boolean {
    if (filter.status.active && filter.status.selected) {
        if (
            filter.status.selected === StatusFilterOption.Confirmed &&
            activity.inclusionState !== InclusionState.Confirmed
        ) {
            return false
        }
        if (
            filter.status.selected === StatusFilterOption.Pending &&
            activity.inclusionState !== InclusionState.Pending
        ) {
            return false
        }
        if (
            filter.status.selected === StatusFilterOption.Claimed &&
            activity.type === ActivityType.Transaction &&
            activity.asyncStatus !== ActivityAsyncStatus.Claimed
        ) {
            return false
        }
        if (
            filter.status.selected === StatusFilterOption.Unclaimed &&
            activity.type === ActivityType.Transaction &&
            (!activity.asyncStatus || activity.asyncStatus === ActivityAsyncStatus.Claimed)
        ) {
            return false
        }
    }
    return true
}

function isVisibleWithActiveTypeFilter(activity: Activity, filter: ActivityFilter): boolean {
    if (filter.type.active && filter.type.selected) {
        if (
            filter.type.selected === TypeFilterOption.Incoming &&
            activity.type === ActivityType.Transaction &&
            activity.direction !== ActivityDirection.Incoming
        ) {
            return false
        }
        if (
            filter.type.selected === TypeFilterOption.Outgoing &&
            activity.type === ActivityType.Transaction &&
            activity.direction !== ActivityDirection.Outgoing
        ) {
            return false
        }
        if (
            filter.type.selected === TypeFilterOption.Internal &&
            activity.type === ActivityType.Transaction &&
            !activity.isInternal
        ) {
            return false
        }
    }
    return true
}
