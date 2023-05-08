import { activeProfile, login } from '@core/profile'
import { get } from 'svelte/store'
import { OnboardingType } from '../enums'
import { onboardingProfile } from '../stores'
import { createNewProfileFromOnboardingProfile } from './createNewProfileFromOnboardingProfile'

export function completeOnboardingProcess(): void {
    // if we already have an active profile
    // it means we are trying to load again after an error
    // and we don't need to add it again
    if (!get(activeProfile)?.id) {
        createNewProfileFromOnboardingProfile()
    }

    const onboardingType = get(onboardingProfile)?.onboardingType
    const shouldCreateAccount = onboardingType === OnboardingType.Create
    const shouldRecoverAccounts = onboardingType === OnboardingType.Restore || onboardingType === OnboardingType.Claim
    void login({ isFromOnboardingFlow: true, shouldCreateAccount, shouldRecoverAccounts })

    onboardingProfile.set(undefined)
}
