import { AccountBalance } from '@iota/wallet'
import { getAccount } from '@core/profile-manager'

export async function getBalance(id?: string): Promise<AccountBalance> {
    return (await getAccount(Number(id)))?.getBalance()
}
