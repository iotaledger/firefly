import { derived, get, Readable, writable } from 'svelte/store'
import { IWalletState } from '@core/wallet/interfaces'
import { activeProfile } from './active-profile.store'

export const activeWallets = writable<IWalletState[]>([])

export function getActiveWallets(): IWalletState[] {
    return get(activeWallets)
}

export function removeWalletFromActiveWallets(walletId: string): void {
    activeWallets?.update((state) => state.filter((wallet) => wallet.id !== walletId))
}

export function addWalletToActiveWallets(wallet: IWalletState): void {
    activeWallets?.update((state) => [...state, wallet])
}

export function updateActiveWallet(walletId: string, partialwallet: Partial<IWalletState>): void {
    activeWallets.update((state) => [
        ...state.map((wallet) => (wallet.id === walletId ? ({ ...wallet, ...partialwallet } as IWalletState) : wallet)),
    ])
}

export const nonHiddenActiveWallets: Readable<IWalletState[]> = derived([activeWallets], ([$activeWallets]) => {
    if (!$activeWallets) {
        return []
    }
    const unsortedNonHiddenwallets = $activeWallets?.filter((wallet) => !wallet?.hidden)
    return unsortedNonHiddenwallets
})

export const visibleActiveWallets: Readable<IWalletState[]> = derived(
    [activeWallets, activeProfile],
    ([$activeWallets, $activeProfile]) => {
        if (!$activeWallets || !$activeProfile) {
            return []
        }
        const unsortedVisiblewallets =
            $activeProfile?.showHiddenWallets ?? false
                ? $activeWallets
                : $activeWallets?.filter((wallet) => !wallet?.hidden)
        return unsortedVisiblewallets
    }
)
