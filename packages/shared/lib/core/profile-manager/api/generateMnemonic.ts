import { get } from 'svelte/store'
import { profileManager } from '../stores'

export function generateMnemonic(): Promise<string> {
    const manager = get(profileManager)
    return manager.generateMnemonic()
}
