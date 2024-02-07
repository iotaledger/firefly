import { COIN_TYPE } from '@core/network/constants'
import { NetworkId } from '@core/network/enums'
import { generateRandomId } from '@core/utils'
import { getSecretManagerFromProfileType } from '@core/profile'
import { get } from 'svelte/store'
import { RestoreProfileType } from '../enums'
import { onboardingProfile, shimmerClaimingProfileManager } from '../stores'
import { DirectoryManager } from '@core/profile/classes'

// TODO(2.0): Fix all shimmer claiming and rename this
export async function createShimmerClaimingProfileManager(): Promise<void> {
    const $onboardingProfile = get(onboardingProfile)
    if (!$onboardingProfile) {
        return
    }

    const storagePath = await DirectoryManager.forTemporaryWallet()
    const coinType = COIN_TYPE[NetworkId.Iota]
    const clientOptions = $onboardingProfile?.clientOptions
    const secretManager = getSecretManagerFromProfileType($onboardingProfile?.type, storagePath)

    const manager = await initialiseProfileManager(
        generateRandomId(),
        storagePath,
        coinType,
        clientOptions,
        secretManager
    )

    if ($onboardingProfile?.restoreProfileType !== RestoreProfileType.Ledger) {
        await manager.setStrongholdPassword($onboardingProfile?.strongholdPassword)
    }

    shimmerClaimingProfileManager.set(manager)
}
