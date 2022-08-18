import { AccountBalance } from '@iota/wallet'

import { IAccount } from '../interfaces'

export async function syncAccountsInParallel(...accounts: IAccount[]): Promise<AccountBalance[]> {
    return Promise.all(accounts.map((account) => account?.sync()))
}
