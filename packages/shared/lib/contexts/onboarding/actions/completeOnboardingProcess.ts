import { get } from 'svelte/store'

import { login } from '@core/profile'

import { ProfileSetupType } from '../enums'
import { onboardingProfile } from '../stores'

import { addOnboardingProfile } from './addOnboardingProfile'
import { cleanupOnboarding } from './cleanupOnboarding'

export async function completeOnboardingProcess(): Promise<void> {
    addOnboardingProfile()

    const shouldRecoverAccounts = get(onboardingProfile)?.setupType === ProfileSetupType.Recovered
    void login(true, shouldRecoverAccounts)

    await cleanupOnboarding()
}
