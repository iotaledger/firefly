import { get } from 'svelte/store'
import { updateActiveWallet } from '@core/profile/stores'
import { selectedWalletId } from '../stores'
import { updateSelectedWallet } from '../stores/selected-wallet.store'
import { getVotingPower } from './getVotingPower'

export function syncVotingPower(walletId = get(selectedWalletId)): void {
    const votingPower = getVotingPower(walletId)
    if (get(selectedWalletId) === walletId) {
        updateSelectedWallet({ votingPower })
    } else {
        updateActiveWallet(walletId, { votingPower })
    }
    return
}
