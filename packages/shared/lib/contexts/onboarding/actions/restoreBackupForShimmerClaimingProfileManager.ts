import { get, Writable } from 'svelte/store'

import { NetworkProtocol } from '@core/network'
import { IProfileManager, profileManager } from '@core/profile-manager'

import {
    copyStrongholdFileToProfileDirectory,
    getShimmerClaimingProfileManagerStorageDirectory,
    validateStrongholdCoinType,
} from '../helpers'
import { onboardingProfile, shimmerClaimingProfileManager } from '../stores'
import { getStorageDirectoryOfProfile } from '@core/profile'
import { ClientOptions } from '@iota/wallet'

export async function restoreBackupForShimmerClaimingProfileManager(strongholdPassword: string): Promise<void> {
    const { id, importFilePath, clientOptions } = get(onboardingProfile)

    const tempProfileDirectory = await getShimmerClaimingProfileManagerStorageDirectory()
    await restoreBackupForShimmerClaimingProfileManagerHelper(
        importFilePath,
        tempProfileDirectory,
        strongholdPassword,
        clientOptions,
        shimmerClaimingProfileManager
    )

    /**
     * NOTE: We must check that the Stronghold was an IOTA-based backup and
     * not a Shimmer one.
     */
    await validateStrongholdCoinType(get(shimmerClaimingProfileManager), NetworkProtocol.IOTA)

    const profileDirectory = await getStorageDirectoryOfProfile(id)
    await restoreBackupForShimmerClaimingProfileManagerHelper(
        importFilePath,
        profileDirectory,
        strongholdPassword,
        clientOptions,
        profileManager
    )
}

async function restoreBackupForShimmerClaimingProfileManagerHelper(
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
