import { derived, Readable, writable } from 'svelte/store'
import { IWalletState } from '@core/wallet/interfaces'
import { activeProfile } from './active-profile.store'

export const activeWallets = writable<IWalletState[]>([])

export function removewalletFromactiveWallets(walletId: string): void {
    activeWallets?.update((state) => state.filter((wallet) => wallet.id !== walletId))
}

export function addwalletToactiveWallets(wallet: IWalletState): void {
    activeWallets?.update((state) => [...state, wallet])
}

export function updateActiveWallet(walletId: string, partialwallet: Partial<IWalletState>): void {
    activeWallets.update((state) => [
        ...state.map((wallet) => (wallet.id === walletId ? { ...wallet, ...partialwallet } as IWalletState: wallet)),
    ])
}

export const nonHiddenActiveWallets: Readable<IWalletState[]> = derived([activeWallets], ([$activeWallets]) => {
    if (!$activeWallets) {
        return []
    }
    const unsortedNonHiddenwallets = $activeWallets?.filter((wallet) => !wallet?.hidden)
    return unsortedNonHiddenwallets // TODO(2.0): Sort them: .sort((a, b) => a.index - b.index)
})

export const visibleActiveWallets: Readable<IWalletState[]> = derived(
    [activeWallets, activeProfile],
    ([$activeWallets, $activeProfile]) => {
        if (!$activeWallets || !$activeProfile) {
            return []
        }
        const unsortedVisiblewallets =
            $activeProfile?.showHiddenAccounts ?? false
                ? $activeWallets
                : $activeWallets?.filter((wallet) => !wallet?.hidden)
        return unsortedVisiblewallets // TODO(2.0): Sort them: .sort((a, b) => a.index - b.index)
    }
)
