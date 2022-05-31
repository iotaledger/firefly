import { get } from 'svelte/store'

import { isDeepLinkRequestActive } from '@common/deep-links'
import { closePopup } from '@lib/popup'
import { selectedMessage } from '@lib/wallet'

import { appRouter, AppRouter } from './app-router'
import { accountRouter, AccountRouter } from './account-router'
import { DashboardRouter, dashboardRouter } from './dashboard-router'
import { DashboardRoute } from './enums'
import { SettingsRouter, settingsRouter } from './settings-router'
import { ledgerRouter, LedgerRouter } from './subrouters'
import { walletRouter, WalletRouter } from './wallet-router'
import { clearSendParams } from '@lib/app'

export const initRouters = (): void => {
    appRouter.set(new AppRouter())
    dashboardRouter.set(new DashboardRouter())
    ledgerRouter.set(new LedgerRouter())
    accountRouter.set(new AccountRouter())
    settingsRouter.set(new SettingsRouter())
    walletRouter.set(new WalletRouter())
}

export const resetRouters = (): void => {
    get(appRouter).reset()
    get(dashboardRouter).reset()
    get(accountRouter).reset()
    get(settingsRouter).reset()
    get(walletRouter).reset()
    isDeepLinkRequestActive.set(false)
}

export const resetAccountRouter = (resetPanels: boolean = true): void => {
    if (resetPanels) {
        get(accountRouter).reset()
        clearSendParams()
    }
    selectedMessage.set(null)
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
