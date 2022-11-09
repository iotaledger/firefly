import { Output } from '@core/wallet'
import { writable } from 'svelte/store'

export const ledgerPreparedOutput = writable<Output>(null)

export function resetLedgerPreparedOutput(): void {
    ledgerPreparedOutput.set(null)
}
