import { get, writable } from 'svelte/store'
import { activeProfile, updateActiveAccount } from '@core/profile'
import { IAccountState } from '../interfaces'

export const selectedAccount = writable<IAccountState>(null)

export function updateSelectedAccount(payload: Partial<IAccountState>): void {
    selectedAccount.update((state) => ({ ...state, ...payload }))
    // Update the selected account in the active accounts store so they stay consistent
    updateActiveAccount(get(selectedAccount).id, payload)
}
