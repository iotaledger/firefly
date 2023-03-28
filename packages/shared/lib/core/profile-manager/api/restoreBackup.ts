import { get } from 'svelte/store'
import { profileManager } from '../stores'

// If IGNORE_IF_COIN_TYPE_MISMATCH is provided wallet.rs won't restore the client options.
// If IGNORE_IF_COIN_TYPE_MISMATCH == true, wallet.rs won't restore the client options, coin type
// and accounts IF the cointype doesn't match
const IGNORE_IF_COIN_TYPE_MISMATCH = true

export async function restoreBackup(importFilePath: string, password: string): Promise<void> {
    const manager = get(profileManager)
    await manager.restoreBackup(importFilePath, password, IGNORE_IF_COIN_TYPE_MISMATCH)
}
