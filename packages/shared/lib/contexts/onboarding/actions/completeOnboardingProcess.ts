import { get } from 'svelte/store'

import { login } from '@core/profile'

import { ProfileSetupType } from '../enums'
import { onboardingProfile } from '../stores'

import { addOnboardingProfile } from './addOnboardingProfile'
import { cleanupOnboarding } from './cleanupOnboarding'

export async function completeOnboardingProcess(): Promise<void> {
    addOnboardingProfile()

    const { setupType } = get(onboardingProfile)
    const shouldRecoverAccounts = setupType === ProfileSetupType.Recovered
    const shouldCreateAccount = setupType === ProfileSetupType.New
    void login(true, shouldRecoverAccounts, shouldCreateAccount)

    await cleanupOnboarding()
}
