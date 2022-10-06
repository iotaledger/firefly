import { get } from 'svelte/store'

import { closePopup } from '@lib/popup'

import { appRouter, AppRouter } from './app-router'
import { collectiblesRouter, CollectiblesRouter } from './collectibles-router'
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
    LoginRouter,
    loginRouter,
} from './subrouters'

export function initialiseRouters(): void {
    /**
     * CAUTION: It is important that subrouters are initialized
     * AFTER the base routers, since each subrouter relies on the
     * its parent router's store during construction.
     */
    initialiseBaseRouters()
    initialiseSubrouters()
}

export function initialiseOnboardingRouters(): void {
    initialiseBaseOnboardingRouters()
    initialiseOnboardingSubrouters()
}

function initialiseBaseRouters(): void {
    appRouter.set(new AppRouter())
    dashboardRouter.set(new DashboardRouter())
    settingsRouter.set(new SettingsRouter())
    collectiblesRouter.set(new CollectiblesRouter())
    initialiseBaseOnboardingRouters()
}

function initialiseBaseOnboardingRouters(): void {
    onboardingRouter.set(new OnboardingRouter())
}

function initialiseSubrouters(): void {
    loginRouter.set(new LoginRouter())
    initialiseOnboardingSubrouters()
}

function initialiseOnboardingSubrouters(): void {
    appSetupRouter.set(new AppSetupRouter())
    ledgerSetupRouter.set(new LedgerSetupRouter())
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
    get(appRouter).reset()
    get(dashboardRouter).reset()
    get(onboardingRouter).reset()
    get(settingsRouter).reset()
    get(collectiblesRouter).reset()
}

function resetSubrouters(): void {
    get(appSetupRouter).reset()
    get(loginRouter).reset()
    get(ledgerSetupRouter).reset()
    get(networkSetupRouter).reset()
    get(strongholdSetupRouter).reset()
    get(profileBackupRouter).reset()
    get(profileRecoveryRouter).reset()
    get(profileSetupRouter).reset()
    get(storageProtectionSetupRouter).reset()
    get(shimmerClaimingRouter).reset()
}

export function resetWalletRoute(): void {
    get(dashboardRouter).reset()
}

export function openSettings(): void {
    closePopup()
    get(dashboardRouter).goTo(DashboardRoute.Settings)
    get(settingsRouter).reset()
}
