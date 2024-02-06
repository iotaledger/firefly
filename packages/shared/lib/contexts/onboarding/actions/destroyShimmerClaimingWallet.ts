import { get } from 'svelte/store'

import { Platform } from '@core/app/classes'

import { shimmerClaimingProfileManager } from '../stores'
import { clearProfileFromMemory } from '@core/profile/actions'
import { DirectoryManager } from '@core/profile/classes'

// TODO(2.0) Fix this

export async function destroyShimmerClaimingWallet(): Promise<void> {
    const _shimmerClaimingProfileManager = get(shimmerClaimingProfileManager)
    if (!_shimmerClaimingProfileManager) {
        return
    }
    await clearProfileFromMemory(shimmerClaimingProfileManager)
    const profilePath = await DirectoryManager.forTemporaryWallet()
    await Platform.removeProfileFolder(profilePath)
}
