import { updateWalletPersistedDataOnActiveProfile } from '@core/profile'
import { IPersistedWalletData, updateSelectedWallet } from 'shared/lib/core/account'
import { selectedWalletId } from 'shared/lib/core/wallet/stores/selected-wallet-id.store'
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
