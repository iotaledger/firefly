import { Balance } from '@iota/wallet'
import { getAccount } from '@core/profile-manager'

export async function getBalance(index?: number): Promise<Balance> {
    return (await getAccount(index))?.getBalance()
}
