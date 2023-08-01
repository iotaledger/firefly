import { Balance, SyncOptions } from '@iota/wallet'

import { IAccount } from '@core/account'

export async function syncAccountsInSeries(syncOptions: SyncOptions, ...accounts: IAccount[]): Promise<Balance[]> {
    const accountBalances: Balance[] = []
    for (const account of accounts) {
        const balance = await account?.sync(syncOptions)
        accountBalances.push(balance)
    }
    return accountBalances
}
