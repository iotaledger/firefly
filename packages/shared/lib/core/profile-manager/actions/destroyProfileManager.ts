import { get } from 'svelte/store'
import { profileManager } from '../store'

export const destroyProfileManager = (): void => {
    const manager = get(profileManager)
    manager.destroy()
    profileManager.set(null)
}
