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
import {
    AppSetupRouter,
    appSetupRouter,
    BackupRouter,
    backupRouter,
    ImportRouter,
    importRouter,
    ledgerRouter,
    LedgerRouter,
    MigrationRouter,
    migrationRouter,
    NetworkRouter,
    networkRouter,
    protectionRouter,
    ProtectionRouter,
} from './subrouters'

export const initRouters = (): void => {
    accountRouter.set(new AccountRouter())
    appRouter.set(new AppRouter())
    appSetupRouter.set(new AppSetupRouter())
    backupRouter.set(new BackupRouter())
    dashboardRouter.set(new DashboardRouter())
    importRouter.set(new ImportRouter())
    ledgerRouter.set(new LedgerRouter())
    migrationRouter.set(new MigrationRouter())
    networkRouter.set(new NetworkRouter())
    onboardingRouter.set(new OnboardingRouter())
    protectionRouter.set(new ProtectionRouter())
    settingsRouter.set(new SettingsRouter())
}

export const resetRouters = (): void => {
    get(appRouter).reset()
    get(appSetupRouter).reset()
    get(accountRouter).reset()
    get(backupRouter).reset()
    get(dashboardRouter).reset()
    get(importRouter).reset()
    get(ledgerRouter).reset()
    get(migrationRouter).reset()
    get(networkRouter).reset()
    get(onboardingRouter).reset()
    get(protectionRouter).reset()
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
