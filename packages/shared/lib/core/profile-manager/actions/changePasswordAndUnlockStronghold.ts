import { activeProfile, setTimeStrongholdLastUnlocked } from '@core/profile'
import { get } from 'svelte/store'
import { changeStrongholdPassword, clearStrongholdPassword } from '../api'

export async function changePasswordAndUnlockStronghold(currentPassword: string, newPassword: string): Promise<void> {
    // Otherwise password persists in memory
    await clearStrongholdPassword()
    await changeStrongholdPassword(currentPassword, newPassword)
    const { isStrongholdLocked } = get(activeProfile)
    isStrongholdLocked.set(false)
    setTimeStrongholdLastUnlocked()
}
