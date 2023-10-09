import { Platform } from '@core/app'
import { profiles } from '@core/profile/stores'
import { getStorageDirectoryOfProfiles } from '@core/profile/utils'
import { get } from 'svelte/store'

export async function renameOldProfileFoldersToId(): Promise<void> {
    const walletPath = await getStorageDirectoryOfProfiles()
    const profileFolders = await Platform.listProfileFolders(walletPath)
    const oldProfiles = get(profiles).filter((profile) =>
        profileFolders.find((p) => p === profile.name && profile.name !== profile.id)
    )
    if (oldProfiles.length > 0) {
        await Promise.all(
            oldProfiles.map(async (profile) => {
                await Platform.renameProfileFolder(profile.name, profile.id)
            })
        )
    }
}
