import { activeAccounts } from '@core/profile'
import { loadAccountActivities } from '@core/wallet'
import { get } from 'svelte/store'

export async function loadAllAccountActivities(): Promise<void> {
    try {
        await Promise.all(get(activeAccounts)?.map((activeAccount) => loadAccountActivities(activeAccount)))
    } catch (err) {
        console.error(err)
    }
}
