import { get, Writable } from 'svelte/store'

import { ClientOptions } from '@iota/wallet'

import { IProfileManager } from '@core/profile-manager'

import { copyStrongholdFileToProfileDirectory } from './copyStrongholdFileToProfileDirectory'
import { UnableToRestoreBackupForProfileManagerError } from '../errors'

export async function restoreBackupForShimmerClaimingProfileManagerHelper(
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
        console.error(err)
        throw new UnableToRestoreBackupForProfileManagerError()
    }
}
