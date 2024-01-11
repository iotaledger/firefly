import { activeProfile, setTimeStrongholdLastUnlocked, unlockStronghold } from '@core/profile'
import { get } from 'svelte/store'
import { changeStrongholdPassword } from '@core/secret-manager'

export async function changePasswordAndUnlockStronghold(currentPassword: string, newPassword: string): Promise<void> {
    await unlockStronghold(currentPassword)
    await changeStrongholdPassword(newPassword)
    const { isStrongholdLocked } = get(activeProfile)
    isStrongholdLocked.set(false)
    setTimeStrongholdLastUnlocked()
}
