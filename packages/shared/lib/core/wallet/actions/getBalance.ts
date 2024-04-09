import { Balance } from '@iota/sdk/out/types'
import { getWalletById } from '@core/profile'

export function getBalance(walletId: string): Balance {
    return getWalletById(walletId)?.getBalance() as unknown as Balance
}
