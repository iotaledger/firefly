import { get } from 'svelte/store'
import { getDefaultClientOptions, NetworkProtocol, NetworkType } from '@core/network'
import { destroyProfileManager, initialiseProfileManager, profileManager } from '@core/profile-manager'
import { ledgerSimulator } from '@lib/ledger'

import { ProfileType } from '../enums'
import { buildNewProfile } from '../helpers'
import { newProfile, updateNewProfile } from '../stores'
import { getStorageDirectoryOfProfile, removeProfileFolder } from '../utils'

/**
 * Builds a new profile and sets Svelte store variables accordingly.
 * @method createNewProfile
 * @param {boolean} isDeveloperProfile
 * @param {NetworkProtocol} networkProtocol
 * @param {NetworkType} networkType
 * @param {string} name
 */
export async function createNewProfile(
    isDeveloperProfile: boolean,
    networkProtocol: NetworkProtocol,
    networkType: NetworkType,
    name: string = ''
): Promise<void> {
    if (get(profileManager)) {
        console.error('Profile is already created')
        return
    }

    // TODO: build custom client options for custom network
    const clientOptions = getDefaultClientOptions(networkProtocol, networkType)
    const profile = buildNewProfile(isDeveloperProfile, networkProtocol, networkType, clientOptions, name)
    newProfile.set(profile)
    const path = await getStorageDirectoryOfProfile(get(newProfile).id)

    initialiseProfileManager(path, clientOptions, {
        Stronghold: { snapshotPath: `${path}/wallet.stronghold` },
    })
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
