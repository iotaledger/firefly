import { get } from 'svelte/store'
import { profileManager } from '../store'

export async function restoreBackup(importFilePath: string, password: string): Promise<void> {
    // TODO: check this once Thoralf exposes this
    const manager = get(profileManager)
    await manager.importAccounts(importFilePath, password)
}
