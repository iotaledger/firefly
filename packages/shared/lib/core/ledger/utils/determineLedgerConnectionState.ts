import { LedgerConnectionState } from '../interfaces'
import { LedgerAppName } from '../enums'
import { LedgerNanoStatus } from '@iota/wallet'

export function determineLedgerConnectionState(status: LedgerNanoStatus): LedgerConnectionState {
    const { connected, locked, app } = status
    if (connected) {
        if (locked) {
            return LedgerConnectionState.Locked
        } else {
            if (app?.name === LedgerAppName.Shimmer) {
                return LedgerConnectionState.CorrectAppOpen
            } else {
                return LedgerConnectionState.AppNotOpen
            }
        }
    } else {
        return LedgerConnectionState.NotConnected
    }
}
