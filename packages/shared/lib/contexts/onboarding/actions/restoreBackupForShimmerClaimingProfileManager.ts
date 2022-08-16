import { get } from 'svelte/store'

import { COIN_TYPE, NetworkProtocol } from '@core/network'
import { getStorageDirectoryOfProfile } from '@core/profile'
import { getSecretManagerPath, profileManager } from '@core/profile-manager'
import { Platform } from '@lib/platform'

import { CannotRestoreWithMismatchedCoinTypeError } from '../errors'
import { onboardingProfile, shimmerClaimingProfileManager } from '../stores'

export async function restoreBackupForShimmerClaimingProfileManager(strongholdPassword: string): Promise<void> {
    const { id, importFilePath } = get(onboardingProfile)

    await get(shimmerClaimingProfileManager)?.restoreBackup(importFilePath, strongholdPassword)

    /**
     * NOTE: We must check that the Stronghold was an IOTA-based backup and
     * not a Shimmer one.
     */
    const accounts = await get(shimmerClaimingProfileManager)?.getAccounts()
    if (accounts?.length > 0 && accounts[0]?.meta?.coinType !== COIN_TYPE[NetworkProtocol.IOTA]) {
        throw new CannotRestoreWithMismatchedCoinTypeError()
    }

    // copy stronghold to profile managers' paths (before any accounts have been loaded, it is possible for 0 accounts to be "loaded")
    const profileDirectory = await getStorageDirectoryOfProfile(id)
    const secretManagerPath = getSecretManagerPath(profileDirectory)
    await Platform.copyFile(importFilePath, secretManagerPath)

    // set stronghold password afterwards
    await get(profileManager)?.setStrongholdPassword(strongholdPassword)
}
