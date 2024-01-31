import { Platform } from '@core/app'
import { UnableToCopyStrongholdBackupFileError } from '../errors'
import { DirectoryManager } from '@core/profile'

export async function copyStrongholdFileToProfileDirectory(profileId: string, importFilePath: string): Promise<void> {
    try {
        const secretManagerPath = await DirectoryManager.forStronghold(profileId)
        await Platform.copyFile(importFilePath, secretManagerPath)
    } catch (err) {
        console.error(err)
        throw new UnableToCopyStrongholdBackupFileError()
    }
}
