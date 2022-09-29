import { get } from 'svelte/store'

import { getStorageDirectoryOfProfile } from '@core/profile'
import { profileManager, restoreBackup } from '@core/profile-manager'

import { onboardingProfile, updateOnboardingProfile } from '../stores'
import { restoreBackupByCopyingFile, validateStrongholdCoinType } from '../helpers'

export async function restoreBackupFromStrongholdFile(
    strongholdPassword: string,
    byCopyingFile = false
): Promise<void> {
    const { id, importFilePath, networkProtocol, clientOptions } = get(onboardingProfile)
    if (byCopyingFile) {
        const storageDirectory = await getStorageDirectoryOfProfile(id)
        await restoreBackupByCopyingFile(
            importFilePath,
            storageDirectory,
            strongholdPassword,
            clientOptions,
            profileManager
        )
    } else {
        await restoreBackup(importFilePath, strongholdPassword)

        /**
         * NOTE: We must check that the Stronghold file's coin_type matches the current networkProtocol
         * and is not based on an alternate protocol.
         */
        await validateStrongholdCoinType(get(profileManager), networkProtocol)

        updateOnboardingProfile({ lastStrongholdBackupTime: new Date() })
    }
}
