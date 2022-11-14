import { get } from 'svelte/store'
import {
    appRouter,
    appSetupRouter,
    collectiblesRouter,
    dashboardRouter,
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
}

function resetBaseRouters(): void {
    get(appRouter).reset()
    get(dashboardRouter).reset()
    get(onboardingRouter).reset()
    get(settingsRouter).reset()
    get(collectiblesRouter).reset()
}
