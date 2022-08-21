import { activeAccounts } from '@core/profile'
import { generateAndStoreActivitiesForAccount } from '@core/wallet'
import { get } from 'svelte/store'

export async function generateAndStoreActivitiesForAllAccounts(): Promise<void> {
    try {
        await Promise.all(
            get(activeAccounts)?.map((activeAccount) => generateAndStoreActivitiesForAccount(activeAccount))
        )
    } catch (err) {
        console.error(err)
    }
}
