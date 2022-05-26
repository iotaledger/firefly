import { setStrongholdPassword } from '@core/profile-manager'
import { activeProfile } from '@core/profile'
import { get } from 'svelte/store'

export async function unlockStronghold(password: string): Promise<void> {
    const { isStrongholdLocked } = get(activeProfile)
    if (get(isStrongholdLocked)) {
        try {
            await setStrongholdPassword(password)
            isStrongholdLocked.set(false)
        } catch (err) {
            throw new Error('error.password.incorrect')
        }
    }
}
