import {
    appRouter,
    collectiblesRouter,
    dashboardRouter,
    governanceRouter,
    ledgerSetupRouter,
    loginRouter,
    onboardingRouter,
    profileBackupRouter,
    profileRecoveryRouter,
    profileSetupRouter,
    settingsRouter,
    shimmerClaimingRouter,
    storageProtectionSetupRouter,
    strongholdSetupRouter,
    updateStrongholdRouter,
} from '@core/router'
import { get } from 'svelte/store'
import { completeOnboardingRouter } from '../../../views/onboarding/views/complete-onboarding/complete-onboarding-router'
import { createFromLedgerRouter } from '../../../views/onboarding/views/create-from-ledger/create-from-ledger-router'
import { createFromMnemonicRouter } from '../../../views/onboarding/views/create-from-mnemonic/create-from-mnemonic-router'
import { createProfileRouter } from '../../../views/onboarding/views/create-profile/create-profile-router'
import { networkSetupRouter } from '../../../views/onboarding/views/network-setup/network-setup-router'
import { restoreProfileRouter } from '../../../views/onboarding/views/restore-profile/restore-profile-router'

export function resetRouters(): void {
    resetSubrouters()
    resetBaseRouters()
}

function resetSubrouters(): void {
    get(loginRouter).reset()
    get(networkSetupRouter).reset()
    get(createProfileRouter).reset()
    get(createFromMnemonicRouter).reset()
    get(createFromLedgerRouter).reset()
    get(restoreProfileRouter).reset()
    get(completeOnboardingRouter).reset()
    get(ledgerSetupRouter).reset()
    get(strongholdSetupRouter).reset()
    get(profileBackupRouter).reset()
    get(profileRecoveryRouter).reset()
    get(profileSetupRouter).reset()
    get(storageProtectionSetupRouter).reset()
    get(shimmerClaimingRouter).reset()
    get(updateStrongholdRouter)?.reset() // Is potentially null because we only initialize it in the respective parent router (login/recovery)
}

function resetBaseRouters(): void {
    get(appRouter).reset()
    get(dashboardRouter).reset()
    get(onboardingRouter).reset()
    get(settingsRouter).reset()
    get(collectiblesRouter).reset()
    get(governanceRouter).reset()
}
