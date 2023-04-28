import { getStorageDirectoryOfProfile } from '@core/profile'
import { profileManager, restoreBackup } from '@core/profile-manager'
import { get } from 'svelte/store'
import { restoreBackupByCopyingFile } from '../helpers'
import { onboardingProfile } from '../stores'

export async function restoreBackupFromStrongholdFile(strongholdPassword: string): Promise<void> {
    const { id, importFilePath, clientOptions } = get(onboardingProfile)
    try {
        await restoreBackup(importFilePath, strongholdPassword)
    } catch (err) {
        const storageDirectory = await getStorageDirectoryOfProfile(id)
        await restoreBackupByCopyingFile(
            importFilePath,
            storageDirectory,
            strongholdPassword,
            clientOptions,
            profileManager
        )
    }
}
