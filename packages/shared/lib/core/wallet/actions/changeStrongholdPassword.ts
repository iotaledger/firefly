import { profileManager } from '@core/profile-manager/stores'
import { get } from 'svelte/store'

export async function changeStrongholdPassword(currentPassword: string, newPassword: string): Promise<void> {
    const manager = get(profileManager)
    await manager.changeStrongholdPassword(currentPassword, newPassword)
}
