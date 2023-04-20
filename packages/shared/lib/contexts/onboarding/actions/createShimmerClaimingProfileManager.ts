import { get } from 'svelte/store'

import { getSecretManagerFromProfileType, initialiseProfileManager } from '@core/profile-manager'
import { generateRandomId } from '@core/utils'

import { getShimmerClaimingProfileManagerStorageDirectory } from '../helpers'
import { shimmerClaimingProfileManager, onboardingProfile } from '../stores'

export async function createShimmerClaimingProfileManager(): Promise<void> {
    const $onboardingProfile = get(onboardingProfile)
    if (!$onboardingProfile) {
        return
    }

    const storagePath = await getShimmerClaimingProfileManagerStorageDirectory()
    const coinType = $onboardingProfile?.network?.coinType
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
