import { Balance, SyncOptions } from '@iota/sdk/out/types'
import { IWallet } from '@core/profile/interfaces'

// TODO(2.0) Fix all usages
export async function syncWalletsInSeries(syncOptions: SyncOptions, ...wallets: IWallet[]): Promise<Balance[]> {
    const walletBalances: Balance[] = []
    for (const wallet of wallets) {
        const balance = await wallet?.sync(syncOptions)
        walletBalances.push(balance)
    }
    return walletBalances
}
