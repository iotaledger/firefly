import { get } from 'svelte/store'

import { isDeepLinkRequestActive } from '@common/deep-links'
import { clearSendParams } from '@lib/app'
import { closePopup } from '@lib/popup'
import { selectedMessage } from '@lib/wallet'

import { appRouter, AppRouter } from './app-router'
import { accountRouter, AccountRouter } from './account-router'
import { DashboardRouter, dashboardRouter } from './dashboard-router'
import { DashboardRoute } from './enums'
import { onboardingRouter, OnboardingRouter } from './onboarding-router'
import { SettingsRouter, settingsRouter } from './settings-router'
import { ledgerRouter, LedgerRouter, NetworkRouter, networkRouter } from './subrouters'

export const initRouters = (): void => {
    appRouter.set(new AppRouter())
    dashboardRouter.set(new DashboardRouter())
    ledgerRouter.set(new LedgerRouter())
    accountRouter.set(new AccountRouter())
    onboardingRouter.set(new OnboardingRouter())
    networkRouter.set(new NetworkRouter())
    settingsRouter.set(new SettingsRouter())
}

export const resetRouters = (): void => {
    get(appRouter).reset()
    get(dashboardRouter).reset()
    get(accountRouter).reset()
    get(onboardingRouter).reset()
    get(networkRouter).reset()
    get(settingsRouter).reset()
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
