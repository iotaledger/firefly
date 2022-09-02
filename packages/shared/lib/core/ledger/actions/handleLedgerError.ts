import { localize } from '@core/i18n'
import { showAppNotification } from '@lib/notifications'
import { closePopup } from '@lib/popup'

import { LEDGER_ERROR_LOCALES } from '../constants'
import { LedgerError } from '../enums'

export function handleLedgerError(error: string): void {
    let message: string
    const hasSetErrorMessage = (ledgerError: LedgerError): boolean => {
        if (error?.includes(ledgerError)) {
            message = localize(LEDGER_ERROR_LOCALES[ledgerError])
            return true
        }
        return false
    }

    switch (true) {
        case hasSetErrorMessage(LedgerError.DeniedByUser):
        case hasSetErrorMessage(LedgerError.DeviceNotFound):
        case hasSetErrorMessage(LedgerError.Transport):
            closePopup(true)
            break
        default:
            message = error
    }

    showAppNotification({
        type: 'error',
        alert: true,
        message,
    })
}
