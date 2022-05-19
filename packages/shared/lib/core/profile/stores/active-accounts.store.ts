import { IAccountMetadata, IAccountState } from '@core/account'
import { derived, Readable, writable } from 'svelte/store'
import { activeProfile, updateAccountMetadataOnActiveProfile } from './active-profile.store'

export const activeAccounts = writable<IAccountState[]>([])

export function addAccountToActiveAccounts(account: IAccountState): void {
    activeAccounts?.update((state) => [...state, account])
}

export function updateActiveAccount(id: string, partialAccount: Partial<IAccountState>): void {
    activeAccounts.update((state) => [
        ...state.map((account) => (account.id === id ? { ...account, ...partialAccount } : account)),
    ])
}

export const visibleActiveAccounts: Readable<IAccountState[]> = derived(
    [activeAccounts, activeProfile],
    ([$activeAccounts, $activeProfile]) => {
        if (!$activeAccounts || !$activeProfile) {
            return []
        }
        const unsortedVisibleAccounts =
            $activeProfile?.settings.showHiddenAccounts ?? false
                ? $activeAccounts
                : $activeAccounts?.filter((account) => !(account?.hidden ?? false))
        return unsortedVisibleAccounts.sort((a, b) => a.meta.index - b.meta.index)
    }
)
