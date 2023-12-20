import { getStorageDirectoryOfProfile } from '@core/profile'
import { get } from 'svelte/store'
import { restoreBackupByCopyingFile } from '../helpers'
import { onboardingProfile } from '../stores'

// TODO(2.0) Fix this

export async function restoreBackupFromStrongholdFile(strongholdPassword: string): Promise<void> {
    const { id, importFilePath, clientOptions, network } = get(onboardingProfile)
    try {
        await restoreBackup(importFilePath, strongholdPassword, network.protocol.bech32Hrp)
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
