import { get } from 'svelte/store'
import { selectedAccountId, selectedMessage } from 'shared/lib/wallet'
import { isDeepLinkRequestActive } from '@common/deep-links'
import {
    appRouter,
    AppRouter,
    accountRouter,
    AccountRouter,
    DashboardRoutes,
    DashboardRouter,
    dashboardRouter,
    ledgerRouter,
    LedgerRouter,
    walletRouter,
    WalletRouter,
    SettingsRouter,
    settingsRouter,
} from '@core/router'
import { closePopup } from 'shared/lib/popup'
import { FireflyEvent } from '@core/router/typings/event'

export const initRouters = (): void => {
    appRouter.set(new AppRouter())
    dashboardRouter.set(new DashboardRouter())
    ledgerRouter.set(new LedgerRouter())
    walletRouter.set(new WalletRouter())
    accountRouter.set(new AccountRouter())
    settingsRouter.set(new SettingsRouter())
}

export const routerNext = (event: CustomEvent<FireflyEvent>): void => {
    get(appRouter).next(event.detail)
}

export const routerPrevious = (): void => {
    get(appRouter).previous()
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
    get(dashboardRouter).goTo(DashboardRoutes.Settings)
    get(settingsRouter).reset()
}
