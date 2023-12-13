import { LedgerNanoStatus } from '@iota/sdk/out/types'
import { writable } from 'svelte/store'

interface ExtendedLedgerNanoStatus extends LedgerNanoStatus {
    busy?: boolean
}

const DEFAULT_LEDGER_STATUS: ExtendedLedgerNanoStatus = {
    app: undefined,
    blindSigningEnabled: false,
    bufferSize: undefined,
    connected: false,
    device: undefined,
    locked: false,
    busy: false,
}

export const ledgerNanoStatus = writable<ExtendedLedgerNanoStatus>(DEFAULT_LEDGER_STATUS)

export function updateLedgerNanoStatus(payload: Partial<ExtendedLedgerNanoStatus>): void {
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
