import { get } from 'svelte/store'

import { getSecretManagerFromProfileType, initialiseProfileManager } from '@core/profile-manager'
import { generateRandomId } from '@core/utils'

import { getTemporaryProfileManagerStorageDirectory } from '../helpers'
import { shimmerClaimingProfileManager, onboardingProfile } from '../stores'
import { COIN_TYPE } from '@core/network/constants'
import { NetworkId } from '@core/network/enums'

export async function createShimmerClaimingProfileManager(): Promise<void> {
    const $onboardingProfile = get(onboardingProfile)
    if (!$onboardingProfile) {
        return
    }

    const storagePath = await getTemporaryProfileManagerStorageDirectory()
    const coinType = COIN_TYPE[NetworkId.Iota]
    const clientOptions = $onboardingProfile?.clientOptions
    const secretManager = getSecretManagerFromProfileType($onboardingProfile?.type, storagePath)

    const manager = await initialiseProfileManager(
        storagePath,
        coinType,
        clientOptions,
        secretManager,
        generateRandomId()
    )
    shimmerClaimingProfileManager.set(manager)
}
