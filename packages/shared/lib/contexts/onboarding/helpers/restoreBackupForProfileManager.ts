import { get, Writable } from 'svelte/store'

import { ClientOptions } from '@iota/wallet'

import { IProfileManager } from '@core/profile-manager'

import { copyStrongholdFileToProfileDirectory } from './copyStrongholdFileToProfileDirectory'

export async function restoreBackupForShimmerClaimingProfileManagerHelper(
    importFilePath: string,
    storageDirectory: string,
    strongholdPassword: string,
    clientOptions: ClientOptions,
    manager: Writable<IProfileManager>
): Promise<void> {
    await copyStrongholdFileToProfileDirectory(storageDirectory, importFilePath)
    await get(manager)?.setStrongholdPassword(strongholdPassword)
    await get(manager)?.setClientOptions(clientOptions)
}
