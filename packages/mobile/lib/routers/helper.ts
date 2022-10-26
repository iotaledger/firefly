import { get } from 'svelte/store'

import { appRouter, AppRouter } from './app-router'
import { dashboardRouter, DashboardRouter } from './dashboard-router'
import { onboardingRouter, OnboardingRouter } from './onboarding-router'
import {
    AppSetupRouter,
    appSetupRouter,
    LoginRouter,
    loginRouter,
    NetworkSetupRouter,
    networkSetupRouter,
    ProfileBackupRouter,
    profileBackupRouter,
    ProfileRecoveryRouter,
    profileRecoveryRouter,
    ProfileSetupRouter,
    profileSetupRouter,
    SendRouter,
    sendRouter,
    storageProtectionSetupRouter,
    StorageProtectionSetupRouter,
    strongholdSetupRouter,
    StrongholdSetupRouter,
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
    initialiseBaseOnboardingRouters()
    initialiseBaseDashboardRouters()
}

function initialiseBaseOnboardingRouters(): void {
    onboardingRouter.set(new OnboardingRouter())
}

function initialiseBaseDashboardRouters(): void {
    dashboardRouter.set(new DashboardRouter())
}

function initialiseSubrouters(): void {
    loginRouter.set(new LoginRouter())
    initialiseOnboardingSubrouters()
    initialiseWalletSubrouters()
}

function initialiseOnboardingSubrouters(): void {
    appSetupRouter.set(new AppSetupRouter())
    networkSetupRouter.set(new NetworkSetupRouter())
    strongholdSetupRouter.set(new StrongholdSetupRouter())
    profileBackupRouter.set(new ProfileBackupRouter())
    profileRecoveryRouter.set(new ProfileRecoveryRouter())
    profileSetupRouter.set(new ProfileSetupRouter())
    storageProtectionSetupRouter.set(new StorageProtectionSetupRouter())
}

function initialiseWalletSubrouters(): void {
    sendRouter.set(new SendRouter())
}

export function resetRouters(): void {
    resetSubrouters()
    resetBaseRouters()
}

function resetBaseRouters(): void {
    get(appRouter).reset()
    get(onboardingRouter).reset()
    get(dashboardRouter).reset()
}

function resetSubrouters(): void {
    get(appSetupRouter).reset()
    get(loginRouter).reset()
    get(networkSetupRouter).reset()
    get(strongholdSetupRouter).reset()
    get(profileBackupRouter).reset()
    get(profileRecoveryRouter).reset()
    get(profileSetupRouter).reset()
    get(storageProtectionSetupRouter).reset()
    get(sendRouter).reset()
}
