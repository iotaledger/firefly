import { getSecretManagerPath } from '@core/profile-manager'
import { Platform } from '@lib/platform'

export async function copyStrongholdFileToProfileDirectory(
    profileDirectory: string,
    importFilePath: string
): Promise<void> {
    const secretManagerPath = getSecretManagerPath(profileDirectory)
    await Platform.copyFile(importFilePath, secretManagerPath)
}
