import { get } from 'svelte/store'

import { destroyProfileManager } from '@core/profile-manager'
import { Platform } from '@lib/platform'

import { getShimmerClaimingProfileManagerStorageDirectory } from '../helpers'
import { shimmerClaimingProfileManager } from '../stores'

export async function destroyShimmerClaimingProfileManager(): Promise<void> {
    const _shimmerClaimingProfileManager = get(shimmerClaimingProfileManager)
    if (!_shimmerClaimingProfileManager) {
        return
    }
    destroyProfileManager(shimmerClaimingProfileManager)
    const profilePath = await getShimmerClaimingProfileManagerStorageDirectory()
    await Platform.removeProfileFolder(profilePath)
}
