import { profileManager } from '@core/profile-manager'
import { get } from 'svelte/store'
import { buildNewProfile } from '../helpers/buildNewProfile'
import { onboardingProfile } from '../stores'

/**
 * Builds a new profile and sets Svelte store variables accordingly.
 * @method createNewProfile
 * @param {boolean} isDeveloperProfile
 */
export function createNewProfile({ isDeveloperProfile }: { isDeveloperProfile: boolean }): Promise<void> {
    if (get(profileManager)) {
        console.error('Profile is already created')
        return
    }

    const _newProfile = buildNewProfile(isDeveloperProfile)
    onboardingProfile.set(_newProfile)
}
