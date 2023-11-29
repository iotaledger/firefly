import { derived, get, Readable } from 'svelte/store'
import { activeWallets, updateActiveWallet } from '@core/profile'
import { IWalletState } from '../interfaces'
import { selectedWalletId } from './selected-wallet-id.store'

export const selectedWallet: Readable<IWalletState | undefined> = derived(
    [selectedWalletId, activeWallets],
    ([$selectedWalletId, $activeWallets]) => {
        return $activeWallets?.find((wallet) => wallet.id === $selectedWalletId)
    }
)

export function getSelectedWallet(): IWalletState {
    return get(selectedWallet) as IWalletState
}

export function updateSelectedWallet(payload: Partial<IWalletState>): void {
    updateActiveWallet(get(selectedWalletId), payload)
}
