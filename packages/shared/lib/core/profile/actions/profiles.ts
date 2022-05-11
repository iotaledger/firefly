import { Platform } from '@lib/platform'
import { getWalletDataPath } from '@lib/wallet'
import { get } from 'svelte/store'
import { profiles } from '../stores'
import { removeProfileFolder } from '../utils'

/**
 * Cleanup profile listed that have nothing stored and stored profiles not in app.
 * @method cleanupEmptyProfiles
 * @returns {Promise<void>}
 */
export async function cleanupEmptyProfiles(): Promise<void> {
    try {
        const profileDataPath = await getWalletDataPath()
        const storedProfiles = await Platform.listProfileFolders(profileDataPath)

        profiles.update((_profiles) => _profiles.filter((p) => storedProfiles.includes(p.id)))

        const appProfiles = get(profiles).map((p) => p.id)
        for (const storedProfile of storedProfiles) {
            if (!appProfiles.includes(storedProfile)) {
                await removeProfileFolder(storedProfile)
            }
        }
    } catch (err) {
        // TODO: improve error handling?
        console.error(err)
    }
}
