import { get } from 'svelte/store'
import { newProfile, ProfileImportType } from '@core/profile'
import { importFilePath, importType, isGettingMigrationData } from '../stores'
import { Platform } from '@lib/platform'
import { getMigrationData } from '@lib/migration'
import { restoreBackup } from '@core/profile-manager'

export async function restoreBackupFromFile(backupFile: Buffer, password: string): Promise<void> {
    if (get(importType) === ProfileImportType.SeedVault) {
        isGettingMigrationData.set(true)

        const legacySeed = await Platform.importLegacySeed(backupFile, password)
        if (legacySeed) {
            await getMigrationData(legacySeed)
        }

        isGettingMigrationData.set(false)
    } else {
        await restoreBackup(get(importFilePath), password)
        get(newProfile).lastStrongholdBackupTime = new Date()
    }
}
