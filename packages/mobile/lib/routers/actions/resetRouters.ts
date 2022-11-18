import { get } from 'svelte/store'

import { appRouter } from '../app-router'
import { dashboardRouter } from '../dashboard-router'
import { onboardingRouter } from '../onboarding-router'
import {
    accountSwitcherRouter,
    appSetupRouter,
    loginRouter,
    networkSetupRouter,
    profileBackupRouter,
    profileRecoveryRouter,
    profileSetupRouter,
    sendRouter,
    storageProtectionSetupRouter,
    strongholdSetupRouter,
} from '../subrouters'

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
    resetOnboardingSubrouters()
    resetDashboardSubrouters()
}

function resetOnboardingSubrouters(): void {
    get(appSetupRouter).reset()
    get(loginRouter).reset()
    get(networkSetupRouter).reset()
    get(strongholdSetupRouter).reset()
    get(profileBackupRouter).reset()
    get(profileRecoveryRouter).reset()
    get(profileSetupRouter).reset()
    get(storageProtectionSetupRouter).reset()
}

function resetDashboardSubrouters(): void {
    get(accountSwitcherRouter).reset()
    get(sendRouter).reset()
}
