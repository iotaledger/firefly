import { getDefaultClientOptions, NetworkProtocol, NetworkType } from '@core/network'
import { buildClientOptions } from '@core/network/helpers'
import { destroyProfileManager } from '@core/profile-manager'
import { ledgerSimulator } from '@lib/ledger'
import { get } from 'svelte/store'
import { ProfileType } from '../enums'
import { buildNewProfile } from '../helpers'
import { activeProfileId, newProfile, updateNewProfile } from '../stores'
import { removeProfileFolder } from '../utils'

/**
 * Builds a new profile and sets Svelte store variables accordingly.
 * @method createNewProfile
 * @param {string} profileName
 * @param {boolean} isDeveloperProfile
 * @param {NetworkProtocol} networkProtocol
 * @param {NetworkType} networkType
 */
export function createNewProfile(
    isDeveloperProfile: boolean,
    networkProtocol: NetworkProtocol,
    networkType: NetworkType
): void {
    // TODO: build custom client options for custom network
    const clientOptions = getDefaultClientOptions(networkProtocol, networkType)
    const profile = buildNewProfile(isDeveloperProfile, networkProtocol, networkType, clientOptions)
    newProfile.set(profile)
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
