import { derived, get, writable } from 'svelte/store'
import { activeProfile } from '@core/profile'

export const selectedAccountId = writable<string>(null)

export const selectedAccount = derived([selectedAccountId], ([$selectedAccountId]) =>
    get(get(activeProfile)?.accounts)?.find((acc) => acc.id === $selectedAccountId)
)

export const setSelectedAccount = (id: string): void => selectedAccountId.set(id)
