import { get } from 'svelte/store'

import { profileManager } from '../stores'

export async function deleteStorage(): Promise<void> {
    const manager = get(profileManager)
    await manager.deleteStorage()
}
