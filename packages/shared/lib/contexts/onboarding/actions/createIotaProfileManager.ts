import { get } from 'svelte/store'

import { COIN_TYPE, NetworkProtocol } from '@core/network'
import { getStorageDirectoryOfProfiles } from '@core/profile'
import { initialiseProfileManager } from '@core/profile-manager'

import { iotaProfileManager, onboardingProfile } from '../stores'

export async function createIotaProfileManager(): Promise<void> {
    const profile = get(onboardingProfile)
    if (!profile) {
        return
    }

    const storageDir = await getStorageDirectoryOfProfiles()
    const storagePath = `${storageDir}/temp`
    const coinType = COIN_TYPE[NetworkProtocol.IOTA]
    const clientOptions = profile?.clientOptions
    const secretManager = {
        Stronghold: { snapshotPath: `${storagePath}/wallet.stronghold` },
    }

    const manager = initialiseProfileManager(storagePath, coinType, clientOptions, secretManager)
    iotaProfileManager.set(manager)
}
