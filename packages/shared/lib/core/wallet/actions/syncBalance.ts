import { getBalance } from './getBalance'
import { get } from 'svelte/store'
import { selectedWalletId } from '../stores/selected-wallet-id.store'
import { updateSelectedWallet } from '../stores/selected-wallet.store'
import { updateActiveWallet } from '@core/profile/stores'

export async function syncBalance(walletId: string): Promise<void> {
    const balances = await getBalance(walletId)
    if (get(selectedWalletId) === walletId) {
        updateSelectedWallet({ balances })
    } else {
        updateActiveWallet(walletId, { balances })
    }
    return
}
