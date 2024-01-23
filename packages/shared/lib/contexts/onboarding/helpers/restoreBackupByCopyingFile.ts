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
        // TODO(2.0) The secret manager doesn't need the client options, so this is fine to not do anymore
        // But, we should make sure 100% of it anyway
        // await secretManager.setClientOptions(clientOptions)
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
