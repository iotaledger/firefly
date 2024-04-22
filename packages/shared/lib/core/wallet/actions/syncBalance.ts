import { get } from 'svelte/store'
import { selectedWalletId, updateSelectedWallet } from '../stores/'
import { getWalletById, updateActiveWallet } from '@core/profile/stores'
import { IBalance } from '../interfaces'
import { getTotalWalletBalance } from '..'

export async function syncBalance(walletId: string, syncCongestion: boolean): Promise<void> {
    const wallet = getWalletById(walletId)
    if (!wallet) return
    const totalBalance: IBalance = await getTotalWalletBalance(wallet, syncCongestion)
    if (get(selectedWalletId) === walletId) {
        updateSelectedWallet({ balances: totalBalance })
    } else {
        updateActiveWallet(walletId, { balances: totalBalance })
    }
    return
}
