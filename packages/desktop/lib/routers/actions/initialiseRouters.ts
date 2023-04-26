import {
    appRouter,
    AppRouter,
    collectiblesRouter,
    CollectiblesRouter,
    DashboardRouter,
    dashboardRouter,
    GovernanceRouter,
    governanceRouter,
    OnboardingRouter,
    onboardingRouter,
    SettingsRouter,
    settingsRouter,
} from '@core/router/routers'
import {
    LedgerSetupRouter,
    ledgerSetupRouter,
    loginRouter,
    LoginRouter,
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
import {
    NetworkSetupRouter,
    networkSetupRouter,
} from '../../../views/onboarding/views/network-setup/network-setup-router'
import {
    CreateProfileRouter,
    createProfileRouter,
} from '../../../views/onboarding/views/create-profile/create-profile-router'
import {
    CreateFromMnemonicRouter,
    createFromMnemonicRouter,
} from '../../../views/onboarding/views/create-from-mnemonic/create-from-mnemonic-router'
import {
    CreateFromLedgerRouter,
    createFromLedgerRouter,
} from '../../../views/onboarding/views/create-from-ledger/create-from-ledger-router'
import {
    CompleteOnboardingRouter,
    completeOnboardingRouter,
} from '../../../views/onboarding/views/complete-onboarding/complete-onboarding-router'
import {
    RestoreProfileRouter,
    restoreProfileRouter,
} from '../../../views/onboarding/views/restore-profile/restore-profile-router'

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
    governanceRouter.set(new GovernanceRouter())
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
    networkSetupRouter.set(new NetworkSetupRouter())
    createProfileRouter.set(new CreateProfileRouter())
    createFromMnemonicRouter.set(new CreateFromMnemonicRouter())
    createFromLedgerRouter.set(new CreateFromLedgerRouter())
    restoreProfileRouter.set(new RestoreProfileRouter())
    completeOnboardingRouter.set(new CompleteOnboardingRouter())
    ledgerSetupRouter.set(new LedgerSetupRouter())
    strongholdSetupRouter.set(new StrongholdSetupRouter())
    profileBackupRouter.set(new ProfileBackupRouter())
    profileRecoveryRouter.set(new ProfileRecoveryRouter())
    profileSetupRouter.set(new ProfileSetupRouter())
    storageProtectionSetupRouter.set(new StorageProtectionSetupRouter())
    shimmerClaimingRouter.set(new ShimmerClaimingRouter())
}
