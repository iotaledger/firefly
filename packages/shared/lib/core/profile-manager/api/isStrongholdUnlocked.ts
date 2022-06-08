import { get } from 'svelte/store'
import { profileManager } from '../stores'

export function isStrongholdUnlocked(): Promise<boolean> {
    const manager = get(profileManager)
    return manager.isStrongholdPasswordAvailable()
}
