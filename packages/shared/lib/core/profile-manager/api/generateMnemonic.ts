import { get } from 'svelte/store'
import { profileManager } from '../store'

export function generateMnemonic(): Promise<string> {
    const manager = get(profileManager)
    return manager.generateMnemonic()
}
