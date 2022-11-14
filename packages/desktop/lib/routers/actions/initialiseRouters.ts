import {
    appRouter,
    AppRouter,
    collectiblesRouter,
    CollectiblesRouter,
    DashboardRouter,
    dashboardRouter,
    OnboardingRouter,
    onboardingRouter,
    SettingsRouter,
    settingsRouter,
} from '@core/router/routers'
import {
    AppSetupRouter,
    appSetupRouter,
    LedgerSetupRouter,
    ledgerSetupRouter,
    loginRouter,
    LoginRouter,
    NetworkSetupRouter,
    networkSetupRouter,
    ProfileBackupRouter,
    profileBackupRouter,
    ProfileRecoveryRouter,
    profileRecoveryRouter,
    ProfileSetupRouter,
    profileSetupRouter,
    ShimmerClaimingRouter,
    shimmerClaimingRouter,
    StorageProtectionSetupRouter,
    storageProtectionSetupRouter,
    StrongholdSetupRouter,
    strongholdSetupRouter,
} from '@core/router/subrouters'

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
