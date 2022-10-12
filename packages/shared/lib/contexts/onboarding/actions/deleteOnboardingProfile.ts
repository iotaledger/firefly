import { destroyProfileManager } from '@core/profile-manager'
import { get } from 'svelte/store'
import { onboardingProfile } from '../stores'
import { removeProfileFolder } from '@core/profile/utils'

/**
 * Deletes a new profile
 * @method deleteNewProfile
 * @returns {void}
 */
export async function deleteOnboardingProfile(): Promise<void> {
    const profile = get(onboardingProfile)
    if (profile) {
        try {
            destroyProfileManager()
            await removeProfileFolder(profile.id)
        } catch (err) {
            console.error(err)
        }
    }
    onboardingProfile.set(null)
}
