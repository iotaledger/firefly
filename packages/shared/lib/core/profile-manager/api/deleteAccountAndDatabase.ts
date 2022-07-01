import { get } from 'svelte/store'

import { profileManager } from '../stores'

export async function deleteAccountsAndDatabase(): Promise<void> {
    const manager = get(profileManager)
    await manager.deleteAccountsAndDatabase()
}
