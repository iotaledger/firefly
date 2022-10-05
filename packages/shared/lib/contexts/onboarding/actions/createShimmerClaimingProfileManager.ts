import { get } from 'svelte/store'

import { COIN_TYPE, NetworkProtocol } from '@core/network'
import { getSecretManagerFromProfileType, initialiseProfileManager } from '@core/profile-manager'
import { generateRandomId } from '@lib/utils'

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
    const secretManager = getSecretManagerFromProfileType(profile?.type, storagePath)

    const manager = initialiseProfileManager(storagePath, coinType, clientOptions, secretManager, generateRandomId())
    shimmerClaimingProfileManager.set(manager)
}
