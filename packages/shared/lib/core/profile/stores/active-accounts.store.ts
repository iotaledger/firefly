import type { IAccountState } from '@core/account'
import { derived, Readable, writable } from 'svelte/store'
import { activeProfile } from './active-profile.store'

export const activeAccounts = writable<IAccountState[]>([])

export function removeAccountFromActiveAccounts(id: string): void {
    activeAccounts?.update((state) => state.filter((account) => account.id !== id))
}

export function addAccountToActiveAccounts(account: IAccountState): void {
    activeAccounts?.update((state) => [...state, account])
}

export function updateActiveAccount(id: string, partialAccount: Partial<IAccountState>): void {
    activeAccounts.update((state) => [
        ...state.map((account) => (account.id === id ? { ...account, ...partialAccount } : account)),
    ])
}

export const nonHiddenActiveAccounts: Readable<IAccountState[]> = derived([activeAccounts], ([$activeAccounts]) => {
    if (!$activeAccounts) {
        return []
    }
    const unsortedNonHiddenAccounts = $activeAccounts?.filter((account) => !account?.hidden)
    return unsortedNonHiddenAccounts.sort((a, b) => a.meta.index - b.meta.index)
})

export const visibleActiveAccounts: Readable<IAccountState[]> = derived(
    [activeAccounts, activeProfile],
    ([$activeAccounts, $activeProfile]) => {
        if (!$activeAccounts || !$activeProfile) {
            return []
        }
        const unsortedVisibleAccounts =
            $activeProfile?.showHiddenAccounts ?? false
                ? $activeAccounts
                : $activeAccounts?.filter((account) => !account?.hidden)
        return unsortedVisibleAccounts.sort((a, b) => a.meta.index - b.meta.index)
    }
)
