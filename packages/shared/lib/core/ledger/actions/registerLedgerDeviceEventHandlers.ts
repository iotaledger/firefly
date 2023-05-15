import { Platform } from '@core/app/classes'
import { LedgerErrorCode } from '@core/ledger'
import { showAppNotification } from '@auxiliary/notification'

export function registerLedgerDeviceEventHandlers(): void {
    Platform.onEvent('ledger-error', (error) => {
        const errorMessage = error?.message ?? JSON.stringify(error)
        const ledgerErrorKeys = Object.keys(LedgerErrorCode)
        const ledgerError = ledgerErrorKeys.find((key) => errorMessage.includes(LedgerErrorCode[key]))
        showAppNotification({
            type: 'error',
            alert: true,
            message: ledgerError,
        })
    })
}
