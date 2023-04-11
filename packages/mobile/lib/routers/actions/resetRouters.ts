import { get } from 'svelte/store'

import {
    appRouter,
    appSetupRouter,
    loginRouter,
    networkInformationSettingsRouter,
    networkSetupRouter,
    onboardingRouter,
    profileBackupRouter,
    profileRecoveryRouter,
    profileRouter,
    profileSetupRouter,
    sendRouter,
    settingsRouter,
    shimmerClaimingRouter,
    storageProtectionSetupRouter,
    strongholdSetupRouter,
} from '../routers'

export function resetRouters(): void {
    resetSubrouters()
    resetBaseRouters()
    resetDrawersRouters()
}

function resetBaseRouters(): void {
    get(appRouter).reset()
    get(onboardingRouter).reset()
}

function resetSubrouters(): void {
    resetOnboardingSubrouters()
    resetDashboardSubrouters()
    resetSettingsSubrouters()
}

function resetOnboardingSubrouters(): void {
    get(appSetupRouter).reset()
    get(loginRouter).reset()
    get(networkSetupRouter).reset()
    get(strongholdSetupRouter).reset()
    get(profileBackupRouter).reset()
    get(profileRecoveryRouter).reset()
    get(profileSetupRouter).reset()
    get(shimmerClaimingRouter).reset()
    get(storageProtectionSetupRouter).reset()
}

function resetDashboardSubrouters(): void {
    get(profileRouter).reset()
    get(settingsRouter).reset()
}

function resetSettingsSubrouters(): void {
    get(networkInformationSettingsRouter).reset()
}

function resetDrawersRouters(): void {
    get(sendRouter).reset()
}
