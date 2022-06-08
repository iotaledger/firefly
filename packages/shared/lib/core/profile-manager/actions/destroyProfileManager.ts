import { get } from 'svelte/store'
import { profileManager } from '../stores'

export const destroyProfileManager = (): void => {
    const manager = get(profileManager)
    if (!manager) return

    manager.destroy()
    profileManager.set(null)
}
