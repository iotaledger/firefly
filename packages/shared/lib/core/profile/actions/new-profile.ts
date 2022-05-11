import { NetworkProtocol, NetworkType } from '@core/network'
import { removeProfileFolder } from '@lib/profile'
import { destroyManager } from '@lib/wallet'
import { get } from 'svelte/store'
import { buildNewProfile } from '../helpers'
import { activeProfileId, newProfile } from '../stores'

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
        destroyManager()
    }
    newProfile.set(null)
    activeProfileId.set(null)
}
