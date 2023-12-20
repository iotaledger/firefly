import { get } from 'svelte/store'
import { updateActiveWallet } from '@core/profile/stores'
import { selectedWalletId } from '../stores'
import { updateSelectedWallet } from '../stores/selected-wallet.store'
import { getVotingPower } from './getVotingPower'

export async function syncVotingPower(walletId = get(selectedWalletId)): Promise<void> {
    const votingPower = await getVotingPower(walletId)
    if (get(selectedWalletId) === walletId) {
        updateSelectedWallet({ votingPower })
    } else {
        updateActiveWallet(walletId, { votingPower })
    }
    return
}
