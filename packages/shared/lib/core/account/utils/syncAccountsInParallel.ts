import { AccountBalance, SyncOptions } from '@iota/wallet'

import { IAccount } from '../interfaces'

export async function syncAccountsInParallel(
    syncOptions: SyncOptions,
    ...accounts: IAccount[]
): Promise<AccountBalance[]> {
    return Promise.all(accounts.map((account) => account?.sync(syncOptions)))
}
