import { get } from 'svelte/store'

import { COIN_TYPE, NetworkProtocol } from '@core/network'
import { initialiseProfileManager } from '@core/profile-manager'
import { generateRandomId } from '@lib/utils'

import { getIotaProfileManagerStorageDirectory } from '../helpers'
import { iotaProfileManager, onboardingProfile } from '../stores'

export async function createIotaProfileManager(): Promise<void> {
    const profile = get(onboardingProfile)
    if (!profile) {
        return
    }

    const storagePath = await getIotaProfileManagerStorageDirectory()
    const coinType = COIN_TYPE[NetworkProtocol.IOTA]
    const clientOptions = profile?.clientOptions
    const secretManager = {
        Stronghold: { snapshotPath: `${storagePath}/wallet.stronghold` },
    }

    const manager = initialiseProfileManager(storagePath, coinType, clientOptions, secretManager, generateRandomId())
    iotaProfileManager.set(manager)
}
