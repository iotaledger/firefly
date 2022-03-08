import { get, readable, writable } from 'svelte/store'
import { selectedAccountId, selectedMessage } from 'shared/lib/wallet'
import { AppRouter } from 'shared/lib/core/router/appRouter'
import { LedgerRoutes, SettingsRoutes, SetupType, Tabs, WalletRoutes } from 'shared/lib/typings/routes'
import { isDeepLinkRequestActive } from '@common/deep-links'
import { closePopup } from './popup'
import { DashboardRouter } from 'shared/lib/core/router/dashboardRouter'
import { LedgerRouter } from 'shared/lib/core/router/ledgerRouter'
import { WalletRouter } from 'shared/lib/core/router/walletRouter'
import { accountRouter, AccountRouter } from 'shared/lib/core/router/accountRouter'

/**
 * Application path based on location hash
 */
export const path = readable<string>(null, (set) => {
    const updatePath = (): void => {
        const pathName = window.location.hash.substr(1)
        set(pathName)
    }

    window.addEventListener('hashchange', updatePath)
    updatePath()

    return (): void => {
        window.removeEventListener('hashchange', updatePath)
    }
})

/**
 * Onboarding/setup type
 */
export const walletSetupType = writable<SetupType>(null)

/*
 * Current view
 */

export const appRouter = writable<AppRouter>(null)

/**
 * Active dashboard tab
 */
export const dashboardRouter = writable<DashboardRouter>(null)

export const dashboardRoute = writable<Tabs>(null)

/**
 * Ledger setup route
 */
export const ledgerRoute = writable<LedgerRoutes>(null)

export const ledgerRouter = writable<LedgerRouter>(null)

/**
 * Wallet view route
 */
export const walletRoute = writable<WalletRoutes>(null)

export const walletRouter = writable<WalletRouter>(null)
/**
 * Account view route
 */

/**
 * Settings view route
 */
export const settingsRoute = writable<SettingsRoutes>(SettingsRoutes.Init)

/**
 * Settings child route
 */
export const settingsChildRoute = writable<string>(null)

/**
 * Navigate to initial route
 */
export const initRouter = (): void => {
    appRouter.set(new AppRouter())
    dashboardRouter.set(new DashboardRouter())
    ledgerRouter.set(new LedgerRouter())
    walletRouter.set(new WalletRouter())
    accountRouter.set(new AccountRouter())
}

// TODO: only handle route changes, not app variables
export const routerNext = (event: CustomEvent): void => {
    get(appRouter).next(event)
}

// TODO: only handle route changes, not app variables
export const routerPrevious = (): void => {
    get(appRouter).previous()
}

export const resetRouter = (): void => {
    get(appRouter).reset()
    get(dashboardRouter).reset()
    get(walletRouter).reset()
    get(accountRouter).reset()
    settingsRoute.set(SettingsRoutes.Init)
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
    get(dashboardRouter).goTo(Tabs.Settings)
    settingsRoute.set(SettingsRoutes.Init)
}
