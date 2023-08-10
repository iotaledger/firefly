import { Balance } from '@iota/sdk/out/types'
import { getAccount } from '@core/profile-manager'

export async function getBalance(index?: number): Promise<Balance> {
    return (await getAccount(index))?.getBalance()
}
