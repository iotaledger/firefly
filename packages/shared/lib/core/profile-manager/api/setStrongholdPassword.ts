import { get } from 'svelte/store'

import { profileManager } from '../stores'

export async function setStrongholdPassword(password: string): Promise<void> {
    const manager = get(profileManager)
    // Otherwise error is thrown, if password is still present in memory
    await manager.clearStrongholdPassword()
    await manager.setStrongholdPassword(password)
}
