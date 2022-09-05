import { Readable, derived } from 'svelte/store'
import { LedgerConnectionState } from '../interfaces'
import { determineLedgerConnectionState } from '../utils'
import { ledgerNanoStatus } from './ledger-nano-status.store'

export const ledgerConnectionState: Readable<LedgerConnectionState> = derived(
    [ledgerNanoStatus],
    ([$ledgerNanoStatus]) => determineLedgerConnectionState($ledgerNanoStatus)
)
