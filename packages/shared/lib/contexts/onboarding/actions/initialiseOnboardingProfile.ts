import { stopPollingLedgerNanoStatus } from 'shared/lib/core/ledger'
import { clearProfileFromMemory } from 'shared/lib/core/profile'
import { get } from 'svelte/store'
import { OnboardingSecretManagerAlreadyInitializedError } from '../errors'
import { buildInitialOnboardingProfile } from '../helpers'
import { isOnboardingLedgerProfile, onboardingProfile, onboardingProfileSecretManager } from '../stores'

/**
 * Builds a new onboarding profile and sets the Svelte store accordingly.
 */
export async function initialiseOnboardingProfile(
    isDeveloperProfile = false,
    destroyPreviousSecretManager = true
): Promise<void> {
    if (get(onboardingProfileSecretManager)) {
        if (destroyPreviousSecretManager) {
            if (get(isOnboardingLedgerProfile)) {
                stopPollingLedgerNanoStatus()
            }
            await clearProfileFromMemory()
        } else {
            throw new OnboardingSecretManagerAlreadyInitializedError()
        }
    }

    const _newProfile = buildInitialOnboardingProfile(isDeveloperProfile)
    onboardingProfile.set(_newProfile)
}
