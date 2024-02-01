import { NetworkId } from '@core/network/enums'
import { getStorageDirectoryOfProfile } from '@core/profile/utils'
import { get } from 'svelte/store'
import { getTemporaryWalletStorageDirectory, restoreBackupByCopyingFile, validateStrongholdCoinType } from '../helpers'
import { onboardingProfile, shimmerClaimingProfileManager } from '../stores'

// TODO(2.0) Fix this
export async function restoreBackupForShimmerClaimingProfileManager(strongholdPassword: string): Promise<void> {
    try {
        const { id, importFilePath, clientOptions } = get(onboardingProfile)
        const tempProfileDirectory = await getTemporaryWalletStorageDirectory()
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
        validateStrongholdCoinType(shimmerClaimingProfileManager, NetworkId.Iota)

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
