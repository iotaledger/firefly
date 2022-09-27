import { get } from 'svelte/store'

import { profileManager } from '@core/profile-manager'

import { OnboardingProfileManagerAlreadyInitializedError } from '../errors'
import { buildOnboardingProfile } from '../helpers'
import { onboardingProfile } from '../stores'
import { NetworkProtocol } from '@core/network'

/**
 * Builds a new onboarding profile and sets the Svelte store accordingly.
 */
export function initialiseOnboardingProfile(isDeveloperProfile: boolean, networkProtocol?: NetworkProtocol): void {
    if (get(profileManager)) {
        throw new OnboardingProfileManagerAlreadyInitializedError()
    }

    const _newProfile = buildOnboardingProfile(isDeveloperProfile, networkProtocol)
    onboardingProfile.set(_newProfile)
}
