import { get } from 'svelte/store'

import { onboardingProfile, updateOnboardingProfile } from '../stores'

import { resetOnboardingProfile } from './resetOnboardingProfile'

export async function resetOnboardingProfileWithProfileManager(): Promise<void> {
    if (get(onboardingProfile)?.hasInitialisedProfileManager) {
        await resetOnboardingProfile()
        updateOnboardingProfile({
            type: null,
            recoveryType: null,
            hasInitialisedProfileManager: false,
            shimmerClaimingAccounts: [],
        })
    }
}
