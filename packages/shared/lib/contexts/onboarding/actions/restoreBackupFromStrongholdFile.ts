import { get } from 'svelte/store'

import { getStorageDirectoryOfProfile } from '@core/profile'
import { profileManager, restoreBackup } from '@core/profile-manager'

import { onboardingProfile, updateOnboardingProfile } from '../stores'
import { restoreBackupByCopyingFile, validateStrongholdCoinType } from '../helpers'

export async function restoreBackupFromStrongholdFile(strongholdPassword: string): Promise<void> {
    const { id, importFilePath, clientOptions, networkProtocol } = get(onboardingProfile)
    try {
        await restoreBackup(importFilePath, strongholdPassword)
        await validateStrongholdCoinType(profileManager, networkProtocol)
        updateOnboardingProfile({ lastStrongholdBackupTime: new Date() })
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
