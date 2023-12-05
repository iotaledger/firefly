import { activeProfile } from '@core/profile'
import { clearStrongholdPassword } from '@core/secret-manager'
import { get } from 'svelte/store'
import { reflectLockedStronghold } from './reflectLockedStronghold'

export async function lockStronghold(): Promise<void> {
    const { isStrongholdLocked } = get(activeProfile)
    if (!get(isStrongholdLocked)) {
        await clearStrongholdPassword()
        reflectLockedStronghold()
    }
}
