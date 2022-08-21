import { get, Writable } from 'svelte/store'

import { api } from '../api'
import { IProfileManager } from '../interfaces'
import { profileManager } from '../stores'

export function destroyProfileManager(_profileManager: Writable<IProfileManager> = profileManager): void {
    const manager = get(_profileManager)
    if (!manager) return

    _profileManager.set(null)
    api.deleteAccountManager(manager?.id)
    manager.destroy()
}
