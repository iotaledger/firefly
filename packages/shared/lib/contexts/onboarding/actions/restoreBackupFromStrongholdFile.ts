import { isMobile } from '@core/app/stores'
import { getStorageDirectoryOfProfile } from '@core/profile'
import { profileManager, restoreBackup } from '@core/profile-manager'
import { get } from 'svelte/store'
import { restoreBackupByCopyingFile, validateStrongholdCoinType } from '../helpers'
import { onboardingProfile, updateOnboardingProfile } from '../stores'

export async function restoreBackupFromStrongholdFile(strongholdPassword: string): Promise<void> {
    const { id, importFilePath, clientOptions, network } = get(onboardingProfile)
    try {
        await restoreBackup(importFilePath, strongholdPassword, network.protocol.bech32Hrp)
        if (isMobile()) {
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
