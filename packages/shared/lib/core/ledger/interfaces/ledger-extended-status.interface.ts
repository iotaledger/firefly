import { LedgerStatus } from './ledger-status.interface'
import { LedgerConnectionState } from './ledger-connection-state.interface'

export interface LedgerExtendedStatus extends LedgerStatus {
    connectionState: LedgerConnectionState
}
