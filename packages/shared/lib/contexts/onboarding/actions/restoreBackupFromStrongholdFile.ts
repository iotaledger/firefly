import { getStorageDirectoryOfProfile } from '@core/profile'
import { restoreBackup } from '@core/wallet'
import { get } from 'svelte/store'
import { restoreBackupByCopyingFile } from '../helpers'
import { onboardingProfile, onboardingProfileSecretManager } from '../stores'

export async function restoreBackupFromStrongholdFile(strongholdPassword: string): Promise<void> {
    const profile = get(onboardingProfile)
    if (profile) {
        const { id, importFilePath, network } = profile
        try {
            await restoreBackup(importFilePath, strongholdPassword, network.protocol.bech32Hrp)
        } catch (err) {
            const storageDirectory = await getStorageDirectoryOfProfile(id)
            const secretManager = get(onboardingProfileSecretManager)
            await restoreBackupByCopyingFile(importFilePath, storageDirectory, strongholdPassword, secretManager)
        }
    }
}
