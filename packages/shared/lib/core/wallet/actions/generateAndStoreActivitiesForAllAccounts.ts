import { get } from 'svelte/store'

import { activeAccounts } from '@core/profile/stores'

import { generateAndStoreActivitiesForAccount } from './activities'

export async function generateAndStoreActivitiesForAllAccounts(): Promise<void> {
    try {
        await Promise.all(
            get(activeAccounts)?.map((activeAccount) => generateAndStoreActivitiesForAccount(activeAccount))
        )
    } catch (err) {
        console.error(err)
    }
}
