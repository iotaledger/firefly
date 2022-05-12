import { NetworkProtocol, NetworkType } from '@core/network'
import { destroyProfileManager } from '@core/profile-manager'
import { ledgerSimulator } from '@lib/ledger'
import { get } from 'svelte/store'
import { ProfileType } from '../enums'
import { buildNewProfile } from '../helpers'
import { activeProfileId, newProfile, updateNewProfile } from '../stores'
import { removeProfileFolder } from '../utils'

/**
 * Builds a new profile and sets Svelte store variables accordingly.
 *
 * @method createNewProfile
 * @param {string} profileName
 * @param {boolean} isDeveloperProfile
 * @param {NetworkProtocol} networkProtocol
 * @param {NetworkType} networkType
 */
export function createNewProfile(
    profileName: string,
    isDeveloperProfile: boolean,
    networkProtocol: NetworkProtocol,
    networkType: NetworkType
): void {
    const profile = buildNewProfile(profileName, isDeveloperProfile, networkProtocol, networkType)
    newProfile.set(profile)
    // not sure if we need to do this when creating a new profile
    // activeProfileId.set(profile.id)
}

/**
 * Deletes a new profile
 *
 * @method deleteNewProfile
 *
 * @returns {void}
 */
export const deleteNewProfile = async (): Promise<void> => {
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
    activeProfileId.set(null)
}

/**
 * Set profile type if missing (for back compatibility purposes)
 * @method setNewProfileType
 * @param {ProfileType} type
 * @returns {void}
 */
export const setNewProfileType = (type: ProfileType): void => {
    type = ledgerSimulator && type === ProfileType.Ledger ? ProfileType.Ledger : type
    updateNewProfile({ type })
}
