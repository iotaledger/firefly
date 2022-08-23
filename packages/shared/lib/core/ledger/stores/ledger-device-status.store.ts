import { writable } from 'svelte/store'
import { LedgerExtendedStatus, LedgerConnectionState } from '../interfaces'

export const ledgerDeviceStatus = writable<LedgerExtendedStatus>({
    connected: false,
    locked: false,
    blindSigningEnabled: false,
    connectionState: LedgerConnectionState.NotDetected,
})
