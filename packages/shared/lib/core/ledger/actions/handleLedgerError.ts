import { localize } from '@core/i18n'
import { showAppNotification } from '@lib/notifications'
import { closePopup } from '@lib/popup'

import { LEDGER_ERROR_LOCALES } from '../constants'
import { LedgerError } from '../enums'

export function handleLedgerError(error: string): void {
    let ledgerError: LedgerError
    const _includes = (_: LedgerError) => {
        if (error?.includes(_)) {
            ledgerError = _
            return true
        }
        return false
    }

    let isLedgerError = true
    switch (true) {
        case _includes(LedgerError.DeniedByUser):
        case _includes(LedgerError.DeviceNotFound):
        case _includes(LedgerError.Transport):
            closePopup(true)
            break
        default:
            isLedgerError = false
            break
    }

    if (isLedgerError) {
        showAppNotification({
            type: 'error',
            alert: true,
            message: localize(LEDGER_ERROR_LOCALES[ledgerError]),
        })
    } else {
        showAppNotification({
            type: 'error',
            alert: true,
            message: error,
        })
    }
}
