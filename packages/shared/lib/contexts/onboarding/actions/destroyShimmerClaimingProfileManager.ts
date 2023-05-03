import { get } from 'svelte/store'

import { destroyProfileManager } from '@core/profile-manager'
import { Platform } from '@core/app'

import { getTemporaryProfileManagerStorageDirectory } from '../helpers'
import { shimmerClaimingProfileManager } from '../stores'

export async function destroyShimmerClaimingProfileManager(): Promise<void> {
    const _shimmerClaimingProfileManager = get(shimmerClaimingProfileManager)
    if (!_shimmerClaimingProfileManager) {
        return
    }
    await destroyProfileManager(shimmerClaimingProfileManager)
    const profilePath = await getTemporaryProfileManagerStorageDirectory()
    await Platform.removeProfileFolder(profilePath)
}
