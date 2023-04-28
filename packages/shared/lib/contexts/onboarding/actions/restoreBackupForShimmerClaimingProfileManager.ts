import { get } from 'svelte/store'
import { getTemporaryProfileManagerStorageDirectory, restoreBackupByCopyingFile } from '../helpers'
import { onboardingProfile, shimmerClaimingProfileManager } from '../stores'

export async function restoreBackupForShimmerClaimingProfileManager(strongholdPassword: string): Promise<void> {
    try {
        const { importFilePath, clientOptions } = get(onboardingProfile)
        const tempProfileDirectory = await getTemporaryProfileManagerStorageDirectory()
        await restoreBackupByCopyingFile(
            importFilePath,
            tempProfileDirectory,
            strongholdPassword,
            clientOptions,
            shimmerClaimingProfileManager
        )
    } catch (err) {
        console.error(err)
        throw err
    }
}
