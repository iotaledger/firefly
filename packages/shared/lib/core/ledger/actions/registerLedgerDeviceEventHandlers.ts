import { Platform } from '@core/app/classes'
import { addError, IError } from '@core/error'

export function registerLedgerDeviceEventHandlers(): void {
    Platform.onEvent('ledger-error', (error) => {
        addError(<IError>{ ...error })
    })
}
