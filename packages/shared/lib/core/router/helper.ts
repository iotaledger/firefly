import { get } from 'svelte/store'

import { isDeepLinkRequestActive } from '@auxiliary/deep-link'
import { closePopup } from '@lib/popup'

import { appRouter, AppRouter } from './app-router'
import { accountRouter, AccountRouter } from './account-router'
import { collectiblesRouter, CollectiblesRouter } from './collectibles-router'
import { DashboardRouter, dashboardRouter } from './dashboard-router'
import { DashboardRoute } from './enums'
import { SettingsRouter, settingsRouter } from './settings-router'
import { ledgerRouter, LedgerRouter } from './subrouters'

export const initRouters = (): void => {
    appRouter.set(new AppRouter())
    dashboardRouter.set(new DashboardRouter())
    ledgerRouter.set(new LedgerRouter())
    accountRouter.set(new AccountRouter())
    settingsRouter.set(new SettingsRouter())
    collectiblesRouter.set(new CollectiblesRouter())
}

export const resetRouters = (): void => {
    get(appRouter).reset()
    get(dashboardRouter).reset()
    get(accountRouter).reset()
    get(settingsRouter).reset()
    get(collectiblesRouter).reset()
    isDeepLinkRequestActive.set(false)
}

export const resetAccountRouter = (resetPanels: boolean = true): void => {
    if (resetPanels) {
        get(accountRouter).reset()
    }
}

export const resetWalletRoute = (): void => {
    resetAccountRouter()
    get(dashboardRouter).reset()
}

export const openSettings = (): void => {
    closePopup()
    get(dashboardRouter).goTo(DashboardRoute.Settings)
    get(settingsRouter).reset()
}
