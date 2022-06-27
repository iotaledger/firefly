import { destroyProfileManager, profileManager } from '@core/profile-manager'
import { ledgerSimulator } from '@lib/ledger'
import { get } from 'svelte/store'
import { ProfileType } from '@core/profile/enums'
import { buildNewProfile } from '../helpers/buildNewProfile'
import { newProfile, updateNewProfile } from '../stores'
import { removeProfileFolder } from '@core/profile/utils'

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
    newProfile.set(_newProfile)
}

/**
 * Deletes a new profile
 * @method deleteNewProfile
 * @returns {void}
 */
export async function deleteNewProfile(): Promise<void> {
    const profile = get(newProfile)
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
    newProfile.set(null)
}

/**
 * Set profile type if missing (for back compatibility purposes)
 * @method setNewProfileType
 * @param {ProfileType} type
 * @returns {void}
 */
export function setNewProfileType(type: ProfileType): void {
    type = ledgerSimulator && type === ProfileType.Ledger ? ProfileType.Ledger : type
    updateNewProfile({ type })
}
