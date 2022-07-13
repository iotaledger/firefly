import { get, Writable } from 'svelte/store'

import { IProfileManager } from '../interfaces'
import { profileManager } from '../stores'

export const destroyProfileManager = (_profileManager: Writable<IProfileManager> = profileManager): void => {
    const manager = get(_profileManager)
    if (!manager) return

    manager.destroy()
    _profileManager.set(null)
}
