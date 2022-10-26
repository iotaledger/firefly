import { get } from 'svelte/store'

import {
    appSetupRouter,
    ledgerSetupRouter,
    loginRouter,
    networkSetupRouter,
    profileBackupRouter,
    profileRecoveryRouter,
    profileSetupRouter,
    shimmerClaimingRouter,
    storageProtectionSetupRouter,
    strongholdSetupRouter,
} from '../subrouters'
import { appRouter, collectiblesRouter, dashboardRouter, onboardingRouter, settingsRouter } from '../routers'

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
