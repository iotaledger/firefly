import { Platform } from '@core/app/classes'
import { get } from 'svelte/store'
import { profiles } from '../../stores'
import { removeProfileFolder } from '../../utils'
import { DirectoryManager } from '../../classes'

/**
 * Cleanup profile listed that have nothing stored and stored profiles not in app.
 * @method cleanupEmptyProfiles
 * @returns {Promise<void>}
 */
export async function cleanupEmptyProfiles(): Promise<void> {
    try {
        const profilesPath = await DirectoryManager.forProfiles()
        const storedProfiles = await Platform.listProfileFolders(profilesPath)

        profiles.update((_profiles) => _profiles?.filter((_profile) => storedProfiles.includes(_profile?.id)))

        const appProfiles = get(profiles)?.map((_profile) => _profile?.id)
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
