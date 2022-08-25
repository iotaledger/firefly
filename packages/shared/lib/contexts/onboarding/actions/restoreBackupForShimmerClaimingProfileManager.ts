import { get } from 'svelte/store'

import { NetworkProtocol } from '@core/network'
import { profileManager } from '@core/profile-manager'

import { copyStrongholdFileToProfileDirectory, validateStrongholdCoinType } from '../helpers'
import { onboardingProfile, shimmerClaimingProfileManager } from '../stores'

export async function restoreBackupForShimmerClaimingProfileManager(strongholdPassword: string): Promise<void> {
    const { id, importFilePath, clientOptions } = get(onboardingProfile)
    await get(shimmerClaimingProfileManager)?.restoreBackup(importFilePath, strongholdPassword)

    /**
     * NOTE: We must check that the Stronghold was an IOTA-based backup and
     * not a Shimmer one.
     */
    await validateStrongholdCoinType(get(shimmerClaimingProfileManager), NetworkProtocol.IOTA)

    await copyStrongholdFileToProfileDirectory(id, importFilePath)
    await get(profileManager)?.setStrongholdPassword(strongholdPassword)
    await get(profileManager)?.setClientOptions(clientOptions)
}
