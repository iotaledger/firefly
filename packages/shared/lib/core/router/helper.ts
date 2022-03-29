import { get } from 'svelte/store'

import { isDeepLinkRequestActive } from '@common/deep-links'
import { closePopup } from '@lib/popup'
import { selectedAccountId, selectedMessage } from '@lib/wallet'

import { appRouter, AppRouter } from './app-router'
import { accountRouter, AccountRouter } from './account-router'
import { DashboardRouter, dashboardRouter } from './dashboard-router'
import { DashboardRoute } from './enums'
import { walletRouter, WalletRouter } from './wallet-router'
import { SettingsRouter, settingsRouter } from './settings-router'
import { ledgerRouter, LedgerRouter } from './subrouters'

export const initRouters = (): void => {
    appRouter.set(new AppRouter())
    dashboardRouter.set(new DashboardRouter())
    ledgerRouter.set(new LedgerRouter())
    walletRouter.set(new WalletRouter())
    accountRouter.set(new AccountRouter())
    settingsRouter.set(new SettingsRouter())
}

export const resetRouters = (): void => {
    get(appRouter).reset()
    get(dashboardRouter).reset()
    get(walletRouter).reset()
    get(accountRouter).reset()
    get(settingsRouter).reset()
    isDeepLinkRequestActive.set(false)
}

export const resetWalletRoute = (): void => {
    get(dashboardRouter).reset()
    get(walletRouter).reset()
    get(accountRouter).reset()

    selectedAccountId.set(null)
    selectedMessage.set(null)
}

export const openSettings = (): void => {
    closePopup()
    get(dashboardRouter).goTo(DashboardRoute.Settings)
    get(settingsRouter).reset()
}
