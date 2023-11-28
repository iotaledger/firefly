import { get } from 'svelte/store'
import { activeWallets, updateActiveProfile } from '@core/profile/stores'
import { resetSendOptionIndex } from '@core/wallet/stores'

import { clearFilters } from '@core/utils'
import { resetNftDownloadQueue } from '@core/nfts'
import { selectedWalletId } from '../stores/selected-wallet-id.store'

// TODO(2.0) Fix all usages
export function setSelectedWallet(walletId: string): void {
    resetNftDownloadQueue(true)

    const account = get(activeWallets)?.find((_account) => _account.id === walletId)
    if (account) {
        selectedWalletId.set(walletId)
        updateActiveProfile({ lastUsedWalletId: walletId })
        clearFilters()
        resetSendOptionIndex()
    } else {
        throw new Error(`Wallet with ID ${walletId} cannot be found!`)
    }
}
