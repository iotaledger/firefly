import { getStorageDirectoryOfProfile } from '@core/profile'
import { getSecretManagerPath } from '@core/profile-manager'
import { Platform } from '@lib/platform'

export async function copyStrongholdFileToProfileDirectory(profileId: string, importFilePath: string): Promise<void> {
    const profileDirectory = await getStorageDirectoryOfProfile(profileId)
    const secretManagerPath = getSecretManagerPath(profileDirectory)
    await Platform.copyFile(importFilePath, secretManagerPath)
}
