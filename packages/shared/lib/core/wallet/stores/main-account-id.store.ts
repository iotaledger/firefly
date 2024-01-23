import { get, writable } from 'svelte/store'
import { updateActiveWalletPersistedData } from '../../profile'
import { selectedWalletId } from './selected-wallet-id.store'

export const mainAccountId = writable<string | null>(null)

export function updateMainAccountId(payload: string): void {
    mainAccountId.set(payload)
    // Update persisted data
    updateActiveWalletPersistedData(get(selectedWalletId), {
        mainAccountId: get(mainAccountId),
    })
}
