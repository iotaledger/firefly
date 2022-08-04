import { parseCurrency } from '@lib/currency'
import { get } from 'svelte/store'
import { Activity } from '../classes'
import { NumberFilterType } from '../interfaces'
import { activityFilter } from '../stores'
import { getAssetFromPersistedAssets } from './getAssetFromPersistedAssets'

export function isFilteredActivity(activity: Activity): boolean {
    const filter = get(activityFilter)

    if (!filter.showHidden.active && activity.isAssetHidden) {
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
    return false
}
