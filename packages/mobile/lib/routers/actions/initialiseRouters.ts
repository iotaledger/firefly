import {
    appRouter,
    AppRouter,
    AppSetupRouter,
    appSetupRouter,
    LoginRouter,
    loginRouter,
    NetworkInformationSettingsRouter,
    networkInformationSettingsRouter,
    NetworkSetupRouter,
    networkSetupRouter,
    onboardingRouter,
    OnboardingRouter,
    ProfileBackupRouter,
    profileBackupRouter,
    ProfileRecoveryRouter,
    profileRecoveryRouter,
    ProfileRouter,
    profileRouter,
    ProfileSetupRouter,
    profileSetupRouter,
    SendRouter,
    sendRouter,
    ShimmerClaimingRouter,
    shimmerClaimingRouter,
    SettingsRouter,
    settingsRouter,
    storageProtectionSetupRouter,
    StorageProtectionSetupRouter,
    strongholdSetupRouter,
    StrongholdSetupRouter,
} from '../routers'

export function initialiseRouters(): void {
    /**
     * CAUTION: It is important that subrouters are initialized
     * AFTER the base routers, since each subrouter relies on the
     * its parent router's store during construction.
     */
    initialiseBaseRouters()
    initialiseSubrouters()
    initializeDrawersRouters()
}

export function initialiseOnboardingRouters(): void {
    initialiseBaseOnboardingRouters()
    initialiseOnboardingSubrouters()
}

function initialiseBaseRouters(): void {
    appRouter.set(new AppRouter())
    initialiseBaseOnboardingRouters()
}

function initialiseBaseOnboardingRouters(): void {
    onboardingRouter.set(new OnboardingRouter())
}

function initialiseSubrouters(): void {
    loginRouter.set(new LoginRouter())
    initialiseOnboardingSubrouters()
    initialiseDashboardSubrouters()
    initialiseSettingsSubrouters()
}

function initialiseOnboardingSubrouters(): void {
    appSetupRouter.set(new AppSetupRouter())
    networkSetupRouter.set(new NetworkSetupRouter())
    strongholdSetupRouter.set(new StrongholdSetupRouter())
    profileBackupRouter.set(new ProfileBackupRouter())
    profileRecoveryRouter.set(new ProfileRecoveryRouter())
    profileSetupRouter.set(new ProfileSetupRouter())
    shimmerClaimingRouter.set(new ShimmerClaimingRouter())
    storageProtectionSetupRouter.set(new StorageProtectionSetupRouter())
}

function initialiseDashboardSubrouters(): void {
    profileRouter.set(new ProfileRouter())
    settingsRouter.set(new SettingsRouter())
}

function initialiseSettingsSubrouters(): void {
    networkInformationSettingsRouter.set(new NetworkInformationSettingsRouter())
}

function initializeDrawersRouters(): void {
    sendRouter.set(new SendRouter())
}
