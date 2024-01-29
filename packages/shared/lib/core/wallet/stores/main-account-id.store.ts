import { derived, get } from 'svelte/store'
import { updateActiveWalletPersistedData } from '../../profile'
import { selectedWalletId } from './selected-wallet-id.store'
import { selectedWallet } from './selected-wallet.store'

export const mainAccountId = derived(selectedWallet, ($selectedWallet) => $selectedWallet?.mainAccountId ?? null)

export function updateMainAccountId(accountId: string | undefined, walletId = get(selectedWalletId)): void {
    // Update persisted data
    updateActiveWalletPersistedData(walletId, {
        mainAccountId: accountId,
    })
}
