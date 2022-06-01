import { getDefaultClientOptions, NetworkProtocol, NetworkType } from '@core/network'
import { destroyProfileManager, initialiseProfileManager } from '@core/profile-manager'
import { cleanupSignup } from '@lib/app'
import { ledgerSimulator } from '@lib/ledger'
import { getProfileDataPath } from '@lib/wallet'
import { get } from 'svelte/store'
import { ProfileType } from '../enums'
import { buildNewProfile } from '../helpers'
import { newProfile, updateNewProfile } from '../stores'
import { removeProfileFolder } from '../utils'

/**
 * Builds a new profile and sets Svelte store variables accordingly.
 * @method createNewProfile
 * @param {string} profileName
 * @param {boolean} isDeveloperProfile
 * @param {NetworkProtocol} networkProtocol
 * @param {NetworkType} networkType
 */
export async function createNewProfile(
    isDeveloperProfile: boolean,
    networkProtocol: NetworkProtocol,
    networkType: NetworkType
): Promise<void> {
    // TODO: build custom client options for custom network
    const clientOptions = await getDefaultClientOptions(networkProtocol, networkType)
    const profile = buildNewProfile(isDeveloperProfile, networkProtocol, networkType, clientOptions)
    newProfile.set(profile)
    const path = await getProfileDataPath(get(newProfile).id)
    initialiseProfileManager(path, clientOptions, {
        Stronghold: { password: '', snapshotPath: `${path}/wallet.stronghold` },
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
            cleanupSignup()
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
