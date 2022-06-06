import { get } from 'svelte/store'
import { profileManager } from '../stores'

export async function verifyMnemonic(mnemonic: string): Promise<void> {
    const manager = get(profileManager)
    await manager.verifyMnemonic(mnemonic)
}
