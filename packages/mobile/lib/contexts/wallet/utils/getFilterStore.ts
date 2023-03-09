import { activityFilter, ActivityFilter, assetFilter, AssetFilter } from '@core/wallet/stores'
import { Writable } from 'svelte/store'
import { FilterType } from '../enums'

export function getFilterStore(filterType: FilterType): Writable<AssetFilter> | Writable<ActivityFilter> {
    switch (filterType) {
        case FilterType.Token:
            return assetFilter
        case FilterType.Activity:
            return activityFilter
    }
}
