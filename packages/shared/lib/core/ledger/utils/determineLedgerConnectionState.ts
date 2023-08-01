import { LedgerConnectionState } from '../interfaces'
import { LedgerAppName } from '../enums'
import { LedgerNanoStatus } from '@iota/wallet/out/types'

export function determineLedgerConnectionState(
    status: LedgerNanoStatus,
    appName = LedgerAppName.Shimmer
): LedgerConnectionState {
    const { connected, app } = status
    if (connected) {
        if (app) {
            if (app.name === appName) {
                return LedgerConnectionState.CorrectAppOpen
            } else {
                return LedgerConnectionState.AppNotOpen
            }
        } else {
            return LedgerConnectionState.Locked
        }
    } else {
        return LedgerConnectionState.NotConnected
    }
}
