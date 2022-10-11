import { AccountBalance } from '@iota/wallet'
import { getAccount } from '@core/profile-manager'

export async function getBalance(index?: number): Promise<AccountBalance> {
    return (await getAccount(index))?.getBalance()
}
