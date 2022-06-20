import { AccountSyncOptions } from '@iota/wallet'
import { get } from 'svelte/store'
import { profileManager } from '../stores'

export async function startBackgroundSync(options?: AccountSyncOptions, interval?: number): Promise<void> {
    const manager = get(profileManager)
    await manager.startBackgroundSync(options, interval)
}
