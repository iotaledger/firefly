import { buildInitialOnboardingProfile } from '../helpers'
import { onboardingProfile } from '../stores'

/**
 * Builds a new onboarding profile and sets the Svelte store accordingly.
 */
export function initialiseOnboardingProfile(
    isDeveloperProfile = false
    /* destroyPreviousManager = false*/
): Promise<void> {
    // TODO(2.0) Profile manager is gone, we should maybe check onboarding SecretManager insteadd
    // if (get(profileManager)) {
    //     if (destroyPreviousManager) {
    //         if (get(isOnboardingLedgerProfile)) {
    //             stopPollingLedgerNanoStatus()
    //         }
    //         await clearProfileFromMemory()
    //     } else {
    //         throw new OnboardingProfileManagerAlreadyInitializedError()
    //     }
    // }

    const _newProfile = buildInitialOnboardingProfile(isDeveloperProfile)
    onboardingProfile.set(_newProfile)
    return Promise.resolve() // TODO(2.0) This is a temporal promise
}
