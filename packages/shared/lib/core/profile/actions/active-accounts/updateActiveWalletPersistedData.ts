import { updateWalletPersistedDataOnActiveProfile } from '@core/profile'
import { IPersistedWalletData, updateSelectedWallet, selectedWalletId } from '@core/wallet'
import { get } from 'svelte/store'

export function updateActiveWalletPersistedData(
    walletId: string,
    partialWalletPersistedData: Partial<IPersistedWalletData>
): void {
    if (get(selectedWalletId) === walletId) {
        updateSelectedWallet(partialWalletPersistedData)
    }
    updateWalletPersistedDataOnActiveProfile(walletId, partialWalletPersistedData)
}
