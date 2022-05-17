import { writable } from 'svelte/store'
import { activeProfile } from '@core/profile'
import { IAccountState } from '../interfaces'

export const selectedAccount = writable<IAccountState>(null)

export function updateSelectedAccount(paylaod: Partial<IAccountState>): void {
    selectedAccount.update((state) => ({ ...state, ...paylaod }))
}
