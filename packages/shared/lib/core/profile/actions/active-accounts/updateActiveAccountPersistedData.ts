import { updateWalletPersistedDataOnActiveProfile } from '@core/profile'
import { IPersistedWalletData, updateSelectedWallet, selectedWalletId } from '@core/wallet'
import { get } from 'svelte/store'

// TODO(2.0) Update this this and fix all usages
export function updateActiveAccountPersistedData(
    walletId: string,
    partialWalletPersistedData: Partial<IPersistedWalletData>
): void {
    if (get(selectedWalletId) === walletId) {
        updateSelectedWallet(partialWalletPersistedData)
    }
    updateWalletPersistedDataOnActiveProfile(walletId, partialWalletPersistedData)
}
