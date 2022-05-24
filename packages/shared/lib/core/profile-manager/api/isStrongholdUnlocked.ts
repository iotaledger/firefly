import { get } from 'svelte/store'
import { profileManager } from '../store'

export function isStrongholdUnlocked(): Promise<boolean> {
    const manager = get(profileManager)
    return manager.isStrongholdPasswordAvailable()
}
