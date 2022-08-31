import { get } from 'svelte/store'

import { api } from '../api'
import { profileManager } from '../stores'

export function destroyProfileManager(_profileManager = profileManager): void {
    const manager = get(_profileManager)
    if (manager) {
        _profileManager.set(null)
        api.deleteAccountManager(manager?.id)
        manager.destroy()
    }
}
