import { LedgerNanoStatus } from '@iota/wallet'
import { writable } from 'svelte/store'

export const ledgerNanoStatus = writable<LedgerNanoStatus>({
    app: null,
    blindSigningEnabled: false,
    bufferSize: null,
    connected: false,
    device: null,
    locked: false,
})

export function updateLedgerNanoStatus(payload: Partial<LedgerNanoStatus>): void {
    return ledgerNanoStatus.update((state) => {
        if (ledgerNanoStatus) {
            return { ...state, ...payload }
        } else {
            return state
        }
    })
}

export function resetLedgerNanoStatus(): void {
    ledgerNanoStatus.set({
        app: null,
        blindSigningEnabled: false,
        bufferSize: null,
        connected: false,
        device: null,
        locked: false,
    })
}
