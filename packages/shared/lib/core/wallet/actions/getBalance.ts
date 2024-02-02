import { Balance } from '@iota/sdk/out/types'
import { getWallet } from '@core/profile/actions'

export async function getBalance(walletId: string): Promise<Balance> {
    return (await getWallet(walletId))?.getBalance()
}
