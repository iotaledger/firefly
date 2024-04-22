import { Platform } from '@core/app'
import { UnableToCopyStrongholdBackupFileError } from '../errors'
import { DirectoryManager } from '@core/profile'

export async function copyStrongholdFileToProfileDirectory(profileId: string, importFilePath: string): Promise<void> {
    try {
        const strongholdPath = await DirectoryManager.forStronghold(profileId)
        await Platform.copyFile(importFilePath, strongholdPath)

        // To be used by `restoreFromStrongholdSnapshot
        const strongholdBackupPath = await DirectoryManager.forStrongholdBackup(profileId)
        await Platform.copyFile(importFilePath, strongholdBackupPath)
    } catch (err) {
        console.error(err)
        throw new UnableToCopyStrongholdBackupFileError()
    }
}
