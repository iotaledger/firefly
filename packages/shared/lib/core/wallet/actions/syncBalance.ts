import { getBalance } from './getBalance'
import { get } from 'svelte/store'
import { selectedWalletId } from '../stores/selected-wallet-id.store'
import { updateSelectedWallet } from '../stores/selected-wallet.store'
import { updateActiveWallet } from '@core/profile/stores'
import { getBicWalletBalance } from './getBicWalletBalance'
import { IBalance } from '../interfaces'

export async function syncBalance(walletId: string, syncOngestion: boolean): Promise<void> {
    const balances = await getBalance(walletId)
    const blockIssuanceCredits = syncOngestion ? await getBicWalletBalance(walletId) : 0
    const totalBalance: IBalance = {
        ...balances,
        ...(syncOngestion && !!blockIssuanceCredits && { blockIssuanceCredits }),
    }
    if (get(selectedWalletId) === walletId) {
        updateSelectedWallet({ balances: totalBalance })
    } else {
        updateActiveWallet(walletId, { balances: totalBalance })
    }
    return
}
