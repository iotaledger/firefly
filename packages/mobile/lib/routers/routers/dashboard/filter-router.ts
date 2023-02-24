import { get, writable, Writable } from 'svelte/store'

import { Subrouter } from '@core/router'
import { deepCopy } from '@core/utils'

import { dashboardRouter } from '../'

import { FilterRoute } from '../../enums'
import { IFilterRouterEvent } from '../../interfaces'
import { resetRouterWithDrawerDelay } from '../../utils'
import { selectedFilter } from '@/contexts/dashboard/stores'
import { FilterAction } from '@/contexts/dashboard/enums'
import { Filter } from '@core/utils/types'

import { activityFilter, assetFilter } from '@core/wallet/stores'
import { proposalFilter } from '@contexts/governance/stores'
import { DEFAULT_ACTIVITY_FILTER, DEFAULT_ASSET_FILTER } from '@core/wallet/constants'
import { DEFAULT_PROPOSAL_FILTER } from '@contexts/governance/constants'

export const filterRoute = writable<FilterRoute>(null)
export const filterRouter = writable<FilterRouter>(null)

export enum FilterType {
    Activity = 'activity',
    Asset = 'asset',
    Proposal = 'proposal',
}

export class FilterRouter extends Subrouter<FilterRoute> {
    constructor() {
        super(FilterRoute.Filter, filterRoute, get(dashboardRouter))
    }

    private filterType: FilterType

    public next(event: IFilterRouterEvent = {}): void {
        const { action, filter, filterType } = event

        if (get(filterRoute) === FilterRoute.Filter) {
            if (!action && filter && filterType) {
                this.filterType = filterType
                selectedFilter.set(filter)
            }

            if (action && filter) {
                this.handleFilterAction(action, filter)
            }
        }
    }

    public closeDrawer(): void {
        selectedFilter.set(null)
        get(dashboardRouter).previous()
        resetRouterWithDrawerDelay(get(filterRouter))
    }

    private handleFilterAction(action: FilterAction, filter: Filter): void {
        if (!filter) {
            return
        }

        switch (action) {
            case FilterAction.Apply:
                this.closeDrawer()
                this.applyFilter(filter)
                return
            case FilterAction.Clear:
                this.clearStoreByFilterType()
                return
        }
    }

    private applyFilter(filter: Filter): void {
        this.getFilterStore().set(deepCopy(filter))
    }

    private clearStoreByFilterType(filterType: FilterType = this.filterType): void {
        switch (filterType) {
            case FilterType.Activity:
                activityFilter.set(DEFAULT_ACTIVITY_FILTER)
                break
            case FilterType.Asset:
                assetFilter.set(DEFAULT_ASSET_FILTER)
                break
            case FilterType.Proposal:
                proposalFilter.set(DEFAULT_PROPOSAL_FILTER)
                break
        }
    }

    public getFilterStore(filterType: FilterType = this.filterType): Writable<Filter> {
        switch (filterType) {
            case FilterType.Activity:
                return activityFilter
            case FilterType.Asset:
                return assetFilter
            case FilterType.Proposal:
                return proposalFilter
            default:
                return writable(null)
        }
    }

    public clearFilterStores(): void {
        Object.values(FilterType).forEach((filterType) => this.clearStoreByFilterType(filterType))
    }
}
