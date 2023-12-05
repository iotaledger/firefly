import { get } from 'svelte/store'
import { profileManager } from '../stores'

export async function backup(dest: string, password: string): Promise<void> {
    const manager = get(profileManager)
    await manager.backup(dest, password)
}
