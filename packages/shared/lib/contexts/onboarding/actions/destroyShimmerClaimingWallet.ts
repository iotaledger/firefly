import { get } from 'svelte/store'

import { Platform } from '@core/app'

import { getTemporaryWalletStorageDirectory } from '../helpers'
import { shimmerClaimingProfileManager } from '../stores'
import { clearProfileFromMemory } from '@core/profile/actions'

// TODO(2.0) Fix this

export async function destroyShimmerClaimingWallet(): Promise<void> {
    const _shimmerClaimingProfileManager = get(shimmerClaimingProfileManager)
    if (!_shimmerClaimingProfileManager) {
        return
    }
    await clearProfileFromMemory(shimmerClaimingProfileManager)
    const profilePath = await getTemporaryWalletStorageDirectory()
    await Platform.removeProfileFolder(profilePath)
}