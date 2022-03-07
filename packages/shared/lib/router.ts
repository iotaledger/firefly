import { AppRouter } from 'shared/lib/router/appRouter'
import {
    AccountRoutes,
    AppRoute,
    LedgerRoutes,
    SettingsRoutes,
    SetupType,
    Tabs,
    WalletRoutes,
} from 'shared/lib/typings/routes'
import { get, readable, writable } from 'svelte/store'

import { isDeepLinkRequestActive } from '@common/deep-links'
import { selectedAccountId } from './wallet'
import { closePopup } from './popup'

/**
 * Sets next route
 *
 * @method setRoute
 *
 * @param {string} path
 *
 * @returns {void}
 */
export const setRoute = (path: AppRoute): void => {
    appRoute.set(path)
}

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
export const appRoute = writable<AppRoute>(null)

export const appRouter = writable<AppRouter>(null)

/**
 * Active dashboard tab
 */
export const dashboardRoute = writable<Tabs>(Tabs.Wallet)

/**
 * Previous dashboard tab
 */
export const previousDashboardRoute = writable<Tabs>(undefined)

/**
 * Ledger setup route
 */
export const ledgerRoute = writable<LedgerRoutes>(LedgerRoutes.LegacyIntro)

/**
 * Ledger setup routing history
 */
export const ledgerRouteHistory = writable<string[]>([])

/**
 * Wallet view route
 */
export const walletRoute = writable<WalletRoutes>(WalletRoutes.Init)

/**
 * Account view route
 */
export const accountRoute = writable<AccountRoutes>(AccountRoutes.Init)

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
}

// TODO: only handle route changes, not app variables
export const routerNext = (event: { detail }): void => {
    get(appRouter).next(event)
}

// TODO: only handle route changes, not app variables
export const routerPrevious = (): void => {
    get(appRouter).previous()
}

export const resetRouter = (): void => {
    get(appRouter).reset()

    walletRoute.set(WalletRoutes.Init)
    accountRoute.set(AccountRoutes.Init)
    settingsRoute.set(SettingsRoutes.Init)
    dashboardRoute.set(Tabs.Wallet)
    isDeepLinkRequestActive.set(false)
}

export const resetWalletRoute = (): void => {
    dashboardRoute.set(Tabs.Wallet)
    walletRoute.set(WalletRoutes.Init)
    accountRoute.set(AccountRoutes.Init)
    selectedAccountId.set(null)
}

export const resetLedgerRoute = (): void => {
    ledgerRoute.set(LedgerRoutes.LegacyIntro)
    ledgerRouteHistory.set([])
}

export const openSettings = (): void => {
    closePopup()
    previousDashboardRoute.set(get(dashboardRoute))
    dashboardRoute.set(Tabs.Settings)
    settingsRoute.set(SettingsRoutes.Init)
}
