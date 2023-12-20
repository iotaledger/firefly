import { get } from 'svelte/store'
import { nonHiddenActiveWallets } from '@core/profile/stores'
import { selectedWallet } from '../stores/selected-wallet.store'
import { setSelectedWallet } from './setSelectedWallet'

// TODO(2.0) Fix all usages
export function setNextSelectedWallet(): void {
    const wallet = get(selectedWallet)
    const otherWallets = get(nonHiddenActiveWallets)
    if (otherWallets.length > 0) {
        if (wallet?.hidden) {
            const walletPosition = otherWallets.findIndex((w) => w.id === wallet.id)
            const nextSelectedWalletId =
                otherWallets[walletPosition + 1]?.id ?? otherWallets[otherWallets?.length - 1]?.id
            setSelectedWallet(nextSelectedWalletId)
        }
    } else {
        throw new Error('No wallets to select from')
    }
}
