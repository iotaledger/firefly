import { IAccount, IAccountBalance } from '@core/account'

export async function syncAccountsInParallel(...accounts: IAccount[]): Promise<IAccountBalance[]> {
    return Promise.all(accounts.map((account) => account?.sync()))
}
