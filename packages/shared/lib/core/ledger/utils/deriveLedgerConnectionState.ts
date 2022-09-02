import { LedgerConnectionState, LedgerStatus } from '../interfaces'
import { LedgerAppName } from '../enums'

export function deriveLedgerConnectionState(status: LedgerStatus): LedgerConnectionState {
    const { locked, connected, app } = status
    if (connected) {
        if (locked) {
            return LedgerConnectionState.Locked
        } else {
            switch (app?.name) {
                case LedgerAppName.Bolos:
                    return LedgerConnectionState.AppNotOpen
                case LedgerAppName.Shimmer:
                    return LedgerConnectionState.Connected
                default:
                    return LedgerConnectionState.OtherConnected
            }
        }
    } else {
        return LedgerConnectionState.NotDetected
    }
}
