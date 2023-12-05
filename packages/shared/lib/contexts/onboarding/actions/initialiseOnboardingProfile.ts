import { stopPollingLedgerNanoStatus } from '@core/ledger'
import { clearProfileFromMemory } from '@core/profile'
import { get } from 'svelte/store'
import { OnboardingProfileManagerAlreadyInitializedError } from '../errors'
import { buildInitialOnboardingProfile } from '../helpers'
import { isOnboardingLedgerProfile, onboardingProfile } from '../stores'

/**
 * Builds a new onboarding profile and sets the Svelte store accordingly.
 */
export async function initialiseOnboardingProfile(
    isDeveloperProfile: boolean,
    destroyPreviousManager = false
): Promise<void> {
    // TODO(2.0) Refactor this logic
    if (get(profileManager)) {
        if (destroyPreviousManager) {
            if (get(isOnboardingLedgerProfile)) {
                stopPollingLedgerNanoStatus()
            }
            await clearProfileFromMemory()
        } else {
            throw new OnboardingProfileManagerAlreadyInitializedError()
        }
    }

    const _newProfile = buildInitialOnboardingProfile(isDeveloperProfile)
    onboardingProfile.set(_newProfile)
}
