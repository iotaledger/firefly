import { LedgerStatus, LedgerConnectionState } from '../interfaces'
import { LedgerAppName } from '../enums'

export function determineLedgerDeviceState(status: LedgerStatus): LedgerConnectionState {
    const { locked, connected, app } = status
    if (locked) {
        return LedgerConnectionState.Locked
    } else {
        switch (app?.name) {
            default:
                if (connected) {
                    /**
                     * NOTE: "BOLOS" is the name of the Ledger operating system and is
                     * sometimes registered as an app.
                     */
                    return app?.name && app?.name !== LedgerAppName.BOLOS
                        ? LedgerConnectionState.OtherConnected
                        : LedgerConnectionState.AppNotOpen
                } else {
                    return LedgerConnectionState.NotDetected
                }
            case LedgerAppName.SHIMMER:
                return LedgerConnectionState.Connected
        }
    }
}
