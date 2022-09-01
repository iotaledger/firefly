import { get } from 'svelte/store'

import { COIN_TYPE, NetworkProtocol } from '@core/network'
import { initialiseProfileManager } from '@core/profile-manager'

import { getShimmerClaimingProfileManagerStorageDirectory } from '../helpers'
import { shimmerClaimingProfileManager, onboardingProfile } from '../stores'

export async function createShimmerClaimingProfileManager(): Promise<void> {
    const profile = get(onboardingProfile)
    if (!profile) {
        return
    }

    const storagePath = await getShimmerClaimingProfileManagerStorageDirectory()
    const coinType = COIN_TYPE[NetworkProtocol.IOTA]
    const clientOptions = profile?.clientOptions
    const secretManager = {
        Stronghold: { snapshotPath: `${storagePath}/wallet.stronghold` },
    }

    const manager = initialiseProfileManager(storagePath, coinType, clientOptions, secretManager)
    shimmerClaimingProfileManager.set(manager)
}
