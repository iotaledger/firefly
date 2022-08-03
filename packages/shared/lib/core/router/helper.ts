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
    ProfileBackupRouter,
    profileBackupRouter,
    ProfileRecoveryRouter,
    profileRecoveryRouter,
    ledgerSetupRouter,
    LedgerSetupRouter,
    MigrationRouter,
    migrationRouter,
    NetworkSetupRouter,
    networkSetupRouter,
    ProfileSetupRouter,
    profileSetupRouter,
    storageProtectionSetupRouter,
    StorageProtectionSetupRouter,
    shimmerClaimingRouter,
    ShimmerClaimingRouter,
    strongholdSetupRouter,
    StrongholdSetupRouter,
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
    ledgerSetupRouter.set(new LedgerSetupRouter())
    migrationRouter.set(new MigrationRouter())
    networkSetupRouter.set(new NetworkSetupRouter())
    strongholdSetupRouter.set(new StrongholdSetupRouter())
    profileBackupRouter.set(new ProfileBackupRouter())
    profileRecoveryRouter.set(new ProfileRecoveryRouter())
    profileSetupRouter.set(new ProfileSetupRouter())
    storageProtectionSetupRouter.set(new StorageProtectionSetupRouter())
    shimmerClaimingRouter.set(new ShimmerClaimingRouter())
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
    get(ledgerSetupRouter).reset()
    get(migrationRouter).reset()
    get(networkSetupRouter).reset()
    get(strongholdSetupRouter).reset()
    get(profileBackupRouter).reset()
    get(profileRecoveryRouter).reset()
    get(profileSetupRouter).reset()
    get(storageProtectionSetupRouter).reset()
    get(shimmerClaimingRouter).reset()
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
