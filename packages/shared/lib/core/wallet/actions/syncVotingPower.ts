import { get } from 'svelte/store'
import { getWalletById, updateActiveWallet } from '@core/profile/stores'
import { selectedWalletId } from '../stores'
import { updateSelectedWallet } from '../stores/selected-wallet.store'

export async function syncVotingPower(walletId = get(selectedWalletId)): Promise<void> {
    const wallet = getWalletById(walletId)
    const votingPower = (await wallet?.getBalance())?.baseCoin.votingPower.toString()
    if (get(selectedWalletId) === walletId) {
        updateSelectedWallet({ votingPower })
    } else {
        updateActiveWallet(walletId, { votingPower })
    }
    return
}
