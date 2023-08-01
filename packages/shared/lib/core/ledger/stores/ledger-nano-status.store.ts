import { LedgerNanoStatus } from '@iota/wallet'
import { writable } from 'svelte/store'

const DEFAULT_LEDGER_STATUS: LedgerNanoStatus = {
    app: undefined,
    blindSigningEnabled: false,
    bufferSize: undefined,
    connected: false,
    device: undefined,
    locked: false,
}

export const ledgerNanoStatus = writable<LedgerNanoStatus>(DEFAULT_LEDGER_STATUS)

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
    ledgerNanoStatus.set(DEFAULT_LEDGER_STATUS)
}
