import { NetworkProtocol, NetworkType } from '@core/network'
import { buildNewProfile } from '../helpers'
import { newProfile } from '../stores'

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
