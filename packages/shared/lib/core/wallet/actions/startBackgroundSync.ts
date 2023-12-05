import { SyncOptions } from '@iota/sdk/out/types'
import { getSelectedWallet } from '../stores'

export async function startBackgroundSync(options?: SyncOptions, interval?: number): Promise<void> {
    const wallet = getSelectedWallet();
    await wallet.startBackgroundSync(options, interval)
}
