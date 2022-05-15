import { activeProfile } from '@core/profile'
import { get } from 'svelte/store'

export async function lockStronghold(): Promise<void> {
    const { isStrongholdLocked } = get(activeProfile)
    if (!get(isStrongholdLocked)) {
        // TODO: lock stronghold
        isStrongholdLocked.set(true)
        return Promise.resolve()
    }
}
