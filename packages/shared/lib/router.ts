import { get, readable, writable } from 'svelte/store'
import { selectedAccountId, selectedMessage } from 'shared/lib/wallet'
import { AppRouter } from 'shared/lib/core/router/appRouter'
import { isDeepLinkRequestActive } from '@common/deep-links'
import { closePopup } from './popup'
import { DashboardRouter, dashboardRouter } from 'shared/lib/core/router/dashboardRouter'
import { ledgerRouter, LedgerRouter } from 'shared/lib/core/router/ledgerRouter'
import { walletRouter, WalletRouter } from 'shared/lib/core/router/walletRouter'
import { accountRouter, AccountRouter } from 'shared/lib/core/router/accountRouter'
import { appRouter } from 'shared/lib/core/router/appRouter'
import { SettingsRouter, settingsRouter } from 'shared/lib/core/router/settingsRouter'
import { DashboardRoutes, SetupType } from '@core/router/enum/routes'

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

/**
 * Navigate to initial route
 */
export const initRouter = (): void => {
    appRouter.set(new AppRouter())
    dashboardRouter.set(new DashboardRouter())
    ledgerRouter.set(new LedgerRouter())
    walletRouter.set(new WalletRouter())
    accountRouter.set(new AccountRouter())
    settingsRouter.set(new SettingsRouter())
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
