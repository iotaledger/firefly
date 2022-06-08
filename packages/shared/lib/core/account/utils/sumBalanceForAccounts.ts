import { IAccountState } from '@core/account'

export function sumBalanceForAccounts(accounts: IAccountState[]): number {
    return accounts.reduce((acc, account) => (acc += Number(account.balances.total)), 0)
}
