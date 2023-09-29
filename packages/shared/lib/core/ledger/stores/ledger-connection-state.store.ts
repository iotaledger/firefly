import { Readable, derived } from 'svelte/store'
import { LedgerConnectionState } from '../interfaces'
import { determineLedgerConnectionState } from '../utils'
import { ledgerNanoStatus } from './ledger-nano-status.store'
import { ledgerAppName } from './ledger-app-name.store'

export const ledgerConnectionState: Readable<LedgerConnectionState> = derived(
    [ledgerNanoStatus, ledgerAppName],
    ([$ledgerNanoStatus, $ledgerAppName]) => determineLedgerConnectionState($ledgerNanoStatus, $ledgerAppName)
)
