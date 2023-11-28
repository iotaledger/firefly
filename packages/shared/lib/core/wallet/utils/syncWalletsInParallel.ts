import { Balance, SyncOptions } from '@iota/sdk/out/types'
import { IWallet } from '@core/profile/interfaces'

export async function syncWalletsInParallel(syncOptions: SyncOptions, ...wallets: IWallet[]): Promise<Balance[]> {
    return Promise.all(wallets.map((wallet) => wallet?.sync(syncOptions)))
}
