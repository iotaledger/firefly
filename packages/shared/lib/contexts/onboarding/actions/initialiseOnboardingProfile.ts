import { get } from 'svelte/store'

import { AppStage, appStage } from '@core/app'
import { profileManager } from '@core/profile-manager'

import { buildOnboardingProfile } from '../helpers'
import { onboardingProfile } from '../stores'

/**
 * Builds a new onboarding profile and sets the Svelte store accordingly.
 */
export function initialiseOnboardingProfile(): Promise<void> {
    if (get(profileManager)) {
        console.error('Profile is already created')
        return
    }

    const isDeveloperProfile = get(appStage) !== AppStage.PROD
    const _newProfile = buildOnboardingProfile(isDeveloperProfile)
    onboardingProfile.set(_newProfile)
}
