import { get } from 'svelte/store'

import { COIN_TYPE, NetworkProtocol } from '@core/network'

import { CannotRestoreWithMismatchedCoinTypeError } from '../errors'
import { onboardingProfile, shimmerClaimingProfileManager } from '../stores'

export async function restoreBackupForShimmerClaimingProfileManager(strongholdPassword: string): Promise<void> {
    const { importFilePath } = get(onboardingProfile)
    await get(shimmerClaimingProfileManager)?.restoreBackup(importFilePath, strongholdPassword)

    /**
     * NOTE: We must check that the Stronghold was an IOTA-based backup and
     * not a Shimmer one.
     */
    const accounts = await get(shimmerClaimingProfileManager)?.getAccounts()
    if (accounts?.length > 0 && accounts[0]?.meta?.coinType !== COIN_TYPE[NetworkProtocol.IOTA]) {
        throw new CannotRestoreWithMismatchedCoinTypeError()
    }
}
