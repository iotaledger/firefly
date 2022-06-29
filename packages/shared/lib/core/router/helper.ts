import { get } from 'svelte/store'

import { isDeepLinkRequestActive } from '@common/deep-links'
import { clearSendParams } from '@lib/app'
import { closePopup } from '@lib/popup'

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
    RecoveryRouter,
    recoveryRouter,
    ledgerRouter,
    LedgerRouter,
    MigrationRouter,
    migrationRouter,
    NetworkRouter,
    networkRouter,
    ProfileSetupRouter,
    profileSetupRouter,
    protectionRouter,
    ProtectionRouter,
} from './subrouters'

export const initRouters = (): void => {
    accountRouter.set(new AccountRouter())
    appRouter.set(new AppRouter())
    appSetupRouter.set(new AppSetupRouter())
    backupRouter.set(new BackupRouter())
    dashboardRouter.set(new DashboardRouter())
    recoveryRouter.set(new RecoveryRouter())
    ledgerRouter.set(new LedgerRouter())
    migrationRouter.set(new MigrationRouter())
    networkRouter.set(new NetworkRouter())
    onboardingRouter.set(new OnboardingRouter())
    profileSetupRouter.set(new ProfileSetupRouter())
    protectionRouter.set(new ProtectionRouter())
    settingsRouter.set(new SettingsRouter())
}

export const resetRouters = (): void => {
    get(appRouter).reset()
    get(appSetupRouter).reset()
    get(accountRouter).reset()
    get(backupRouter).reset()
    get(dashboardRouter).reset()
    get(recoveryRouter).reset()
    get(ledgerRouter).reset()
    get(migrationRouter).reset()
    get(networkRouter).reset()
    get(onboardingRouter).reset()
    get(profileSetupRouter).reset()
    get(protectionRouter).reset()
    get(settingsRouter).reset()

    isDeepLinkRequestActive.set(false)
}

export const resetAccountRouter = (resetPanels: boolean = true): void => {
    if (resetPanels) {
        get(accountRouter).reset()
        clearSendParams()
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
