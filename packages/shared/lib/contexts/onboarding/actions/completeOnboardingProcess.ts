import { get } from 'svelte/store'

import { login, UnableToFindProfileSetupTypeError } from '@core/profile'

import { ProfileSetupType } from '../enums'
import { onboardingProfile } from '../stores'

import { addOnboardingProfile } from './addOnboardingProfile'
import { cleanupOnboarding } from './cleanupOnboarding'

export async function completeOnboardingProcess(): Promise<void> {
    addOnboardingProfile()

    const setupType = get(onboardingProfile)?.setupType
    if (!setupType) {
        throw new UnableToFindProfileSetupTypeError()
    }

    const shouldRecoverAccounts = setupType === ProfileSetupType.Recovered
    const shouldCreateAccount = setupType === ProfileSetupType.New
    void login({ isFromOnboardingFlow: true, shouldRecoverAccounts, shouldCreateAccount })

    await cleanupOnboarding()
}
