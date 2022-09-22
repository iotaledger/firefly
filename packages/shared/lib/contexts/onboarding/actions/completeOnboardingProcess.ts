import { activeProfile, login, UnableToFindProfileSetupTypeError } from '@core/profile'
import { get } from 'svelte/store'
import { ProfileSetupType } from '../enums'
import { onboardingProfile } from '../stores'
import { createNewProfileFromOnboardingProfile } from './createNewProfileFromOnboardingProfile'

export function completeOnboardingProcess(): void {
    // if we already have an active profile
    // it means we are trying to load again after an error
    // and we don't need to add it again
    if (!get(activeProfile)?.id) {
        createNewProfileFromOnboardingProfile()
    }

    const setupType = get(onboardingProfile)?.setupType
    if (!setupType) {
        throw new UnableToFindProfileSetupTypeError()
    }

    const shouldRecoverAccounts = setupType === ProfileSetupType.Recovered
    const shouldCreateAccount = setupType === ProfileSetupType.New
    void login({ isFromOnboardingFlow: true, shouldRecoverAccounts, shouldCreateAccount })
}
