import { destroyProfileManager } from '@core/profile-manager'
import { get } from 'svelte/store'
import { onboardingProfile } from '../stores'
import { removeProfileFolder } from '@core/profile/utils'

/**
 * Deletes a new profile
 * @method deleteNewProfile
 * @returns {void}
 */
export async function deleteNewProfile(): Promise<void> {
    const profile = get(onboardingProfile)
    if (profile) {
        try {
            // TODO: delete storage with new api when implemented
            // await asyncDeleteStorage()
            await removeProfileFolder(profile.id)
        } catch (err) {
            console.error(err)
        }
        destroyProfileManager()
    }
    onboardingProfile.set(null)
}
