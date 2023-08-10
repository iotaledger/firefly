import { Output } from '@iota/sdk/out/types'
import { writable } from 'svelte/store'

export const ledgerPreparedOutput = writable<Output>(null)

export function resetLedgerPreparedOutput(): void {
    ledgerPreparedOutput.set(null)
}
