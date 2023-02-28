import { get } from 'svelte/store'

import {
    accountActionsRouter,
    accountSwitcherRouter,
    appRouter,
    appSetupRouter,
    dashboardRouter,
    loginRouter,
    networkConfigurationSettingsRouter,
    networkSetupRouter,
    onboardingRouter,
    profileBackupRouter,
    profileRecoveryRouter,
    profileRouter,
    profileSetupRouter,
    sendRouter,
    shimmerClaimingRouter,
    settingsRouter,
    storageProtectionSetupRouter,
    strongholdSetupRouter,
    filterRouter,
} from '../routers'

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
    get(accountSwitcherRouter).reset()
    get(accountActionsRouter).reset()
    get(sendRouter).reset()
    get(filterRouter).reset()
    get(profileRouter).reset()
    get(settingsRouter).reset()
}

function resetSettingsSubrouters(): void {
    get(networkConfigurationSettingsRouter).reset()
}
