import { get } from 'svelte/store'
import { profileManager } from '../stores'

export async function storeMnemonic(mnemonic: string): Promise<void> {
    const manager = get(profileManager)
    await manager.storeMnemonic(mnemonic)
}
