import { get } from 'svelte/store'

import { dashboardRouter } from '../routers'

export function resetWalletRoute(): void {
    get(dashboardRouter).reset()
}
