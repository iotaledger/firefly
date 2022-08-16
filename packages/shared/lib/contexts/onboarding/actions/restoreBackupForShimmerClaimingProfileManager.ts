import { get } from 'svelte/store'

import { COIN_TYPE, NetworkProtocol } from '@core/network'
import { profileManager } from '@core/profile-manager'

import { CannotRestoreWithMismatchedCoinTypeError } from '../errors'
import { copyStrongholdFileToProfileDirectory } from '../helpers'
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

    await copyStrongholdFileToProfileDirectory(id, importFilePath)
    await get(profileManager)?.setStrongholdPassword(strongholdPassword)
}
