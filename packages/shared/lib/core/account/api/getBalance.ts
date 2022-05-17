import { getAccount } from '@core/profile-manager'
import { IAccountBalances } from '../interfaces/account-balances.interface'

export async function getBalance(id?: string): Promise<IAccountBalances> {
    return (await getAccount(Number(id)))?.getBalance()
}
