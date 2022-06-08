import { getDefaultClientOptions, NetworkProtocol, NetworkType } from '@core/network'
import {
    backup,
    destroyProfileManager,
    initialiseProfileManager,
    storeMnemonic,
    verifyMnemonic,
} from '@core/profile-manager'
import { cleanupSignup, mnemonic, strongholdPassword, walletPin } from '@lib/app'
import { ledgerSimulator } from '@lib/ledger'
import { getProfileDataPath, walletSetupType } from '@lib/wallet'
import { get } from 'svelte/store'
import { ProfileType } from '../enums'
import { buildNewProfile } from '../helpers'
import { newProfile, updateNewProfile } from '../stores'
import { removeProfileFolder } from '../utils'
import { Platform } from '@lib/platform'
import { getDefaultStrongholdName } from '@lib/utils'
import { SetupType } from '@lib/typings/setup'

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

/**
 * Creates an initial backup for a profile's Stronghold.
 */
export async function backupInitialStronghold(): Promise<void> {
    const strongholdBackupDestination = await Platform.getStrongholdBackupDestination(getDefaultStrongholdName())
    if (strongholdBackupDestination) {
        await backup(strongholdBackupDestination, get(strongholdPassword))
        updateNewProfile({ lastStrongholdBackupTime: new Date() })
    }
}

/**
 * Handles the cleanup process for the protection segment of the onboarding flow.
 */
export async function cleanupProtectionOnboarding(pinInput: string): Promise<void> {
    await Platform.PincodeManager.set(get(newProfile)?.id, pinInput)
    // TODO: replace with new api when it is implemented
    // await setStoragePassword(pinInput)
    if (get(walletSetupType) === SetupType.Mnemonic) {
        await storeAndCleanMnemonic()
    }

    walletPin.set(null)
}

/**
 * Verifies, stores, then clears the mnemonic used in the onboarding flow.
 */
export async function storeAndCleanMnemonic(): Promise<void> {
    const _mnemonic = get(mnemonic).join(' ')

    await verifyMnemonic(_mnemonic)
    await storeMnemonic(_mnemonic)

    mnemonic.set(null)
}
