import { get, Writable } from 'svelte/store'

import { IClientOptions } from '@iota/sdk/out/types'

import { ClientError, CLIENT_ERROR_REGEXES } from '@core/error'

import { copyStrongholdFileToProfileDirectory } from '../helpers'
import { StrongholdMigrationRequiredError, UnableToRestoreBackupForProfileManagerError } from '../errors'

// TODO(2.0) Fix this, profile manager is gone
export async function restoreBackupByCopyingFile(
    importFilePath: string,
    storageDirectory: string,
    strongholdPassword: string,
    clientOptions: IClientOptions,
    manager: Writable<IProfileManager>
): Promise<void> {
    try {
        await copyStrongholdFileToProfileDirectory(storageDirectory, importFilePath)
        await get(manager)?.setStrongholdPassword(strongholdPassword)
        await get(manager)?.setClientOptions(clientOptions)
    } catch (err) {
        if (CLIENT_ERROR_REGEXES[ClientError.MigrationRequired].test(err?.error)) {
            throw new StrongholdMigrationRequiredError()
        } else if (CLIENT_ERROR_REGEXES[ClientError.InvalidStrongholdPassword].test(err?.error)) {
            throw err
        } else {
            throw new UnableToRestoreBackupForProfileManagerError()
        }
    }
}
