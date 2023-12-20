import { get } from 'svelte/store'

import { activeWallets } from '@core/profile/stores'

import { generateAndStoreActivitiesForWallet } from './activities'

export async function generateAndStoreActivitiesForAllWallets(): Promise<void> {
    try {
        await Promise.all(get(activeWallets)?.map((activeWallet) => generateAndStoreActivitiesForWallet(activeWallet)))
    } catch (err) {
        console.error(err)
    }
}
