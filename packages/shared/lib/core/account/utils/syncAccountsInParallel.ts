import { AccountBalance, AccountSyncOptions } from '@iota/wallet'

import { IAccount } from '../interfaces'

export async function syncAccountsInParallel(
    syncOptions: AccountSyncOptions,
    ...accounts: IAccount[]
): Promise<AccountBalance[]> {
    return Promise.all(accounts.map((account) => account?.sync(syncOptions)))
}
