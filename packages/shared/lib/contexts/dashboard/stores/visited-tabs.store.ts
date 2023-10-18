import { DashboardRoute } from '@core/router'
import { persistent } from '@core/utils/store'
import { Writable, get } from 'svelte/store'

export const visitedTabsStore: Writable<DashboardRoute[]> = persistent('visitedTabs', [
    DashboardRoute.Wallet,
    DashboardRoute.Collectibles,
    DashboardRoute.Governance,
    DashboardRoute.Developer,
])

export function addToVisitedTabs(value: DashboardRoute): void {
    const currentStore = get(visitedTabsStore)
    if (!currentStore.includes(value)) {
        visitedTabsStore.update((currentStore) => [...currentStore, value])
    }
}

export function removeFromVisitedTabs(value: DashboardRoute): void {
    const currentStore = get(visitedTabsStore)
    if (currentStore.includes(value)) {
        visitedTabsStore.update((currentStore) => currentStore.filter((item) => item !== value))
    }
}
