import { Platform } from '@core/app'
import { UnableToCopyStrongholdBackupFileError } from '../errors'
import { DirectoryManager } from '@core/profile'

export async function copyStrongholdFileToProfileDirectory(profileId: string, importFilePath: string): Promise<void> {
    try {
        const strongholdPath = await DirectoryManager.forStronghold(profileId)
        await Platform.copyFile(importFilePath, strongholdPath)
    } catch (err) {
        console.error(err)
        throw new UnableToCopyStrongholdBackupFileError()
    }
}
