import { getStorageDirectoryOfProfile } from '@core/profile'
import { profileManager, restoreBackup } from '@core/profile-manager'
import { get } from 'svelte/store'
import { restoreBackupByCopyingFile, validateStrongholdCoinType } from '../helpers'
import { onboardingProfile, updateOnboardingProfile } from '../stores'
import { mobile } from '@core/app'

export async function restoreBackupFromStrongholdFile(strongholdPassword: string): Promise<void> {
    const { id, importFilePath, clientOptions, network } = get(onboardingProfile)
    try {
        await restoreBackup(importFilePath, strongholdPassword)
        if (mobile) {
            await validateStrongholdCoinType(profileManager, network?.id)
            updateOnboardingProfile({ lastStrongholdBackupTime: new Date() })
        }
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
