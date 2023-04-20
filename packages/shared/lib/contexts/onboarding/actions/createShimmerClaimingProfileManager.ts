import { get } from 'svelte/store'

import { COIN_TYPE } from '@core/network'
import { getSecretManagerFromProfileType, initialiseProfileManager } from '@core/profile-manager'
import { generateRandomId } from '@core/utils'

import { getShimmerClaimingProfileManagerStorageDirectory } from '../helpers'
import { shimmerClaimingProfileManager, onboardingProfile } from '../stores'
import { COIN_TYPE } from '@core/network/constants'
import { NetworkId } from '@core/network/enums'

export async function createShimmerClaimingProfileManager(): Promise<void> {
    const profile = get(onboardingProfile)
    if (!profile) {
        return
    }

    const storagePath = await getShimmerClaimingProfileManagerStorageDirectory()
    const coinType = COIN_TYPE[NetworkId.Iota]
    const clientOptions = profile?.clientOptions
    const secretManager = getSecretManagerFromProfileType(profile?.type, storagePath)

    const manager = await initialiseProfileManager(
        storagePath,
        coinType,
        clientOptions,
        secretManager,
        generateRandomId()
    )
    shimmerClaimingProfileManager.set(manager)
}
