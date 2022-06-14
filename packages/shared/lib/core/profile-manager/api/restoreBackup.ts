import { get } from 'svelte/store'
import { profileManager } from '../stores'

export async function restoreBackup(importFilePath: string, password: string): Promise<void> {
    const manager = get(profileManager)
    await manager.restoreBackup(importFilePath, password)
}
