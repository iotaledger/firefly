import { get } from 'svelte/store'

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

export function initRouters(): void {
    /**
     * CAUTION: It is important that subrouters are initialized
     * AFTER the base routers, since each subrouter relies on the
     * its parent router's store during construction.
     */
    initBaseRouters()
    initSubrouters()
}

function initBaseRouters(): void {
    accountRouter.set(new AccountRouter())
    appRouter.set(new AppRouter())
    dashboardRouter.set(new DashboardRouter())
    onboardingRouter.set(new OnboardingRouter())
    settingsRouter.set(new SettingsRouter())
}

function initSubrouters(): void {
    appSetupRouter.set(new AppSetupRouter())
    backupRouter.set(new BackupRouter())
    ledgerRouter.set(new LedgerRouter())
    migrationRouter.set(new MigrationRouter())
    networkRouter.set(new NetworkRouter())
    profileSetupRouter.set(new ProfileSetupRouter())
    protectionRouter.set(new ProtectionRouter())
    recoveryRouter.set(new RecoveryRouter())
}

export function resetRouters(): void {
    resetSubrouters()
    resetBaseRouters()
}

function resetBaseRouters(): void {
    get(accountRouter).reset()
    get(appRouter).reset()
    get(dashboardRouter).reset()
    get(onboardingRouter).reset()
    get(settingsRouter).reset()
}

function resetSubrouters(): void {
    get(appSetupRouter).reset()
    get(backupRouter).reset()
    get(recoveryRouter).reset()
    get(ledgerRouter).reset()
    get(migrationRouter).reset()
    get(networkRouter).reset()
    get(profileSetupRouter).reset()
    get(protectionRouter).reset()
}

export function resetAccountRouter(resetPanels: boolean = true): void {
    if (resetPanels) {
        get(accountRouter).reset()
    }
}

export function resetWalletRoute(): void {
    resetAccountRouter()
    get(dashboardRouter).reset()
}

export function openSettings(): void {
    closePopup()
    get(dashboardRouter).goTo(DashboardRoute.Settings)
    get(settingsRouter).reset()
}
