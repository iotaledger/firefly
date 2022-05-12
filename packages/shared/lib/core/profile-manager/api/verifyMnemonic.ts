import { get } from 'svelte/store'
import { profileManager } from '../store'

export async function verifyMnemonic(mnemonic: string): Promise<void> {
    const manager = get(profileManager)
    await manager.verifyMnemonic(mnemonic)
}
