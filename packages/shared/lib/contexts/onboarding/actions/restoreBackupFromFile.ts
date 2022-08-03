import { get } from 'svelte/store'

import { restoreBackup } from '@core/profile-manager'
import { Platform } from '@lib/platform'

import { onboardingProfile } from '../stores'

import { ProfileRecoveryType } from '../enums'
import { isGettingMigrationData } from '../stores'

export async function restoreBackupFromFile(backupFile: Buffer, password: string): Promise<void> {
    const profileRecoveryType = get(onboardingProfile)?.recoveryType
    if (profileRecoveryType === ProfileRecoveryType.SeedVault) {
        isGettingMigrationData.set(true)

        const legacySeed = await Platform.importLegacySeed(backupFile, password)
        if (legacySeed) {
            // await getMigrationData(legacySeed)
        }

        isGettingMigrationData.set(false)
    } else {
        await restoreBackup(get(onboardingProfile)?.importFilePath, password)
        get(onboardingProfile).lastStrongholdBackupTime = new Date()
    }
}
