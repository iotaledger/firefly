import { writable } from 'svelte/store'

import { INITIAL_ACTIVE_DASHBOARD_TAB } from '../constants'
import { DashboardTab } from '../enums'

export const activeDashboardTab = writable<DashboardTab>(INITIAL_ACTIVE_DASHBOARD_TAB)

export function updateActiveDashboardTab(tab: DashboardTab): void {
    activeDashboardTab?.set(tab)
}
