import { get, Writable } from 'svelte/store'

import { ClientOptions } from '@iota/wallet'

import { ClientError, CLIENT_ERROR_REGEXES } from '@core/error'
import { IProfileManager } from '@core/profile-manager'

import { copyStrongholdFileToProfileDirectory } from '../helpers'
import { UnableToRestoreBackupForProfileManagerError } from '../errors'

export async function restoreBackupByCopyingFile(
    importFilePath: string,
    storageDirectory: string,
    strongholdPassword: string,
    clientOptions: ClientOptions,
    manager: Writable<IProfileManager>
): Promise<void> {
    try {
        await copyStrongholdFileToProfileDirectory(storageDirectory, importFilePath)
        await get(manager)?.setStrongholdPassword(strongholdPassword)
        await get(manager)?.setClientOptions(clientOptions)
    } catch (err) {
        if (CLIENT_ERROR_REGEXES[ClientError.InvalidStrongholdPassword].test(err?.error)) {
            throw err
        } else {
            throw new UnableToRestoreBackupForProfileManagerError()
        }
    }
}
