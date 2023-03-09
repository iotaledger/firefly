import { get } from 'svelte/store'
import {
    appRouter,
    appSetupRouter,
    collectiblesRouter,
    dashboardRouter,
    governanceRouter,
    ledgerSetupRouter,
    loginRouter,
    networkSetupRouter,
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

export function resetRouters(): void {
    resetSubrouters()
    resetBaseRouters()
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
    get(updateStrongholdRouter).reset()
}

function resetBaseRouters(): void {
    get(appRouter).reset()
    get(dashboardRouter).reset()
    get(onboardingRouter).reset()
    get(settingsRouter).reset()
    get(collectiblesRouter).reset()
    get(governanceRouter).reset()
}
