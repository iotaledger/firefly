import { LedgerNanoStatus } from '@iota/sdk/out/types'
import { USE_LEDGER_SIMULATOR } from '../constants'
import { LedgerAppName } from '../enums'
import { LedgerConnectionState } from '../interfaces'

export function determineLedgerConnectionState(
    status: LedgerNanoStatus,
    appName: LedgerAppName
): LedgerConnectionState {
    const { connected, app } = status
    if (connected) {
        if (app) {
            if (USE_LEDGER_SIMULATOR) {
                if (app?.version === '0.8.7') {
                    return LedgerConnectionState.CorrectAppOpen
                } else {
                    return LedgerConnectionState.AppNotOpen
                }
            } else {
                if (app.name === appName) {
                    return LedgerConnectionState.CorrectAppOpen
                } else {
                    return LedgerConnectionState.AppNotOpen
                }
            }
        } else {
            return LedgerConnectionState.Locked
        }
    } else {
        return LedgerConnectionState.NotConnected
    }
}
