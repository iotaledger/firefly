import { Platform } from '@core/app'
import { getSecretManagerPath } from '@core/profile/utils'

import { UnableToCopyStrongholdBackupFileError } from '../errors'

// TODO(2.0) Fix getSecretManagerPath

export async function copyStrongholdFileToProfileDirectory(
    profileDirectory: string,
    importFilePath: string
): Promise<void> {
    try {
        const secretManagerPath = getSecretManagerPath(profileDirectory)
        await Platform.copyFile(importFilePath, secretManagerPath)
    } catch (err) {
        console.error(err)
        throw new UnableToCopyStrongholdBackupFileError()
    }
}
