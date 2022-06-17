import { activeProfile, setTimeStrongholdLastUnlocked } from '@core/profile'
import { get } from 'svelte/store'
import { changeStrongholdPassword } from '../api'

export async function changePasswordAndUnlockStronghold(newPassword: string): Promise<void> {
    await changeStrongholdPassword(newPassword)
    const { isStrongholdLocked } = get(activeProfile)
    isStrongholdLocked.set(false)
    setTimeStrongholdLastUnlocked()
}
