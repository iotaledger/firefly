import { get } from 'svelte/store'

import { stopPollingLedgerNanoStatus } from '@core/ledger'
import { NetworkProtocol } from '@core/network'
import { destroyProfileManager, profileManager } from '@core/profile-manager'

import { OnboardingProfileManagerAlreadyInitializedError } from '../errors'
import { buildOnboardingProfile } from '../helpers'
import { isOnboardingLedgerProfile, onboardingProfile } from '../stores'

/**
 * Builds a new onboarding profile and sets the Svelte store accordingly.
 */
export async function initialiseOnboardingProfile(
    isDeveloperProfile: boolean,
    networkProtocol?: NetworkProtocol,
    overrideExistingProfileManager = false
): Promise<void> {
    if (get(profileManager)) {
        if (overrideExistingProfileManager) {
            if (get(isOnboardingLedgerProfile)) {
                stopPollingLedgerNanoStatus()
            }
            await destroyProfileManager()
        } else {
            throw new OnboardingProfileManagerAlreadyInitializedError()
        }
    }

    const _newProfile = buildOnboardingProfile(isDeveloperProfile, networkProtocol)
    onboardingProfile.set(_newProfile)
}
