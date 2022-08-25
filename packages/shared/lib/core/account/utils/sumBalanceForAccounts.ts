import { IAccountState } from '@core/account'

export function sumBalanceForAccounts(accounts: IAccountState[]): number {
    return accounts.reduce(
        (total: number, account: IAccountState) => (total += Number(account.balances.baseCoin.total)),
        0
    )
}
