import { AccountBalance, SyncOptions } from '@iota/wallet'

import { IAccount } from '@core/account'

export async function syncAccountsInSeries(
    syncOptions: SyncOptions,
    ...accounts: IAccount[]
): Promise<AccountBalance[]> {
    const accountBalances: AccountBalance[] = []
    for (const account of accounts) {
        const balance = await account?.sync(syncOptions)
        accountBalances.push(balance)
    }
    return accountBalances
}
