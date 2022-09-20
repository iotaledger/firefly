import { AccountBalance, AccountSyncOptions } from '@iota/wallet'

import { IAccount } from '@core/account'

export async function syncAccountsInSeries(
    syncOptions: AccountSyncOptions,
    ...accounts: IAccount[]
): Promise<AccountBalance[]> {
    const accountBalances: AccountBalance[] = []
    for (const account of accounts) {
        const balance = await account?.sync(syncOptions)
        accountBalances.push(balance)
    }
    return accountBalances
}
