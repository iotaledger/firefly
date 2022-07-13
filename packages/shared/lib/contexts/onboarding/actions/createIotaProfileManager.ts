import { get } from 'svelte/store'

import { CoinType } from '@iota/wallet'

import { initialiseProfileManager } from '@core/profile-manager'
import { getStorageDirectoryOfProfile } from '@core/profile'

import { iotaProfileManager, newProfile } from '../stores'

export async function createIotaProfileManager(): Promise<void> {
    const profile = get(newProfile)
    if (!profile) {
        return
    }

    const storagePath = await getStorageDirectoryOfProfile(profile?.id)
    const secretManager = {
        Stronghold: { snapshotPath: `${storagePath}/wallet.stronghold` },
    }

    initialiseProfileManager(storagePath, CoinType.IOTA, profile.clientOptions, secretManager, iotaProfileManager)
}
