import { ClientError, CLIENT_ERROR_REGEXES } from '@core/error'
import { copyStrongholdFileToProfileDirectory } from '../helpers'
import { StrongholdMigrationRequiredError, UnableToRestoreBackupForWalletError } from '../errors'
import { SecretManager } from '@iota/sdk'

export async function restoreBackupByCopyingFile(
    importFilePath: string,
    storageDirectory: string,
    strongholdPassword: string,
    secretManager: SecretManager
): Promise<void> {
    try {
        await copyStrongholdFileToProfileDirectory(storageDirectory, importFilePath)
        await secretManager.setStrongholdPassword(strongholdPassword)
    } catch (err) {
        if (CLIENT_ERROR_REGEXES[ClientError.MigrationRequired].test(err?.error)) {
            throw new StrongholdMigrationRequiredError()
        } else if (CLIENT_ERROR_REGEXES[ClientError.InvalidStrongholdPassword].test(err?.error)) {
            throw err
        } else {
            throw new UnableToRestoreBackupForWalletError()
        }
    }
}
