import { AppStage, Platform, appStage } from '@core/app'
import { get } from 'svelte/store'
import { profiles } from '../../stores'
import { getStorageDirectoryOfProfiles, removeProfileFolder } from '../../utils'

/**
 * Cleanup profile listed that have nothing stored and stored profiles not in app.
 * @method cleanupEmptyProfiles
 * @returns {Promise<void>}
 */
export async function cleanupEmptyProfiles(): Promise<void> {
    if (get(appStage) === AppStage.ALPHA) {
        return
    }

    try {
        const profileDataPath = await getStorageDirectoryOfProfiles()
        const storedProfiles = await Platform.listProfileFolders(profileDataPath)

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
