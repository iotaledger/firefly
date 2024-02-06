import { NetworkId } from '@core/network/enums'
import { DirectoryManager } from '@core/profile/classes'
import { get } from 'svelte/store'
import { restoreBackupByCopyingFile, validateStrongholdCoinType } from '../helpers'
import { onboardingProfile, shimmerClaimingProfileManager } from '../stores'

// TODO(2.0) Fix this
export async function restoreBackupForShimmerClaimingProfileManager(strongholdPassword: string): Promise<void> {
    try {
        const { id, importFilePath, clientOptions } = get(onboardingProfile)
        const tempProfileDirectory = await DirectoryManager.forTemporaryWallet()
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

        const profileDirectory = await DirectoryManager.forProfile(id)
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
