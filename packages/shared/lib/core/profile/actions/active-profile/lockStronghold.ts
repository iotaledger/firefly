import { activeProfile } from '@core/profile'
import { clearStrongholdPassword } from '@core/profile-manager'
import { get } from 'svelte/store'

export async function lockStronghold(): Promise<void> {
    const { isStrongholdLocked } = get(activeProfile)
    if (!get(isStrongholdLocked)) {
        await clearStrongholdPassword()
        isStrongholdLocked.set(true)
    }
}
