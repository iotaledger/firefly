import { get, Writable } from 'svelte/store'

import { api } from '@core/api'
import { IProfileManager } from '../interfaces'
import { profileManager } from '../stores'

// TODO(2.0): replace all its usage with api.clearWalletsFromMemory()
export async function destroyProfileManager(
    _profileManager: Writable<IProfileManager> = profileManager
): Promise<void> {
    const manager = get(_profileManager)
    if (!manager) return

    _profileManager.set(null)
    api.clearWalletsFromMemory()
    await manager.destroy()
}
