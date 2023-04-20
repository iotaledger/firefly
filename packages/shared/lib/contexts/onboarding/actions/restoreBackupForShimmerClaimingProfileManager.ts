import { get } from 'svelte/store'

import { getStorageDirectoryOfProfile } from '@core/profile'
import { profileManager } from '@core/profile-manager'

import {
    getShimmerClaimingProfileManagerStorageDirectory,
    restoreBackupByCopyingFile,
    validateStrongholdCoinType,
} from '../helpers'
import { onboardingProfile, shimmerClaimingProfileManager } from '../stores'
import { NetworkId } from '@core/network/enums'

export async function restoreBackupForShimmerClaimingProfileManager(strongholdPassword: string): Promise<void> {
    try {
        const { id, importFilePath, clientOptions } = get(onboardingProfile)

        const tempProfileDirectory = await getShimmerClaimingProfileManagerStorageDirectory()
        await restoreBackupByCopyingFile(
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
        await validateStrongholdCoinType(shimmerClaimingProfileManager, NetworkId.Iota)

        const profileDirectory = await getStorageDirectoryOfProfile(id)
        await restoreBackupByCopyingFile(
            importFilePath,
            profileDirectory,
            strongholdPassword,
            clientOptions,
            profileManager
        )
    } catch (err) {
        console.error(err)
        throw err
    }
}
