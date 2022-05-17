import { derived, get, writable } from 'svelte/store'
import { activeProfile } from '@core/profile'
import { IAccountState } from '../interfaces'

export const selectedAccountId = writable<string>(null)

export const selectedAccount = derived(
    [selectedAccountId, activeProfile],
    ([$selectedAccountId, $activeProfile]) =>
        get($activeProfile?.accounts)?.find((acc) => acc.id == $selectedAccountId),
    <IAccountState>{}
)

export const setSelectedAccount = (id: string): void => selectedAccountId.set(id)
