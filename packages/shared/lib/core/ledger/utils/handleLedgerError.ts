import { localize } from '@core/i18n'
import { showAppNotification } from '@lib/notifications'
import { closePopup } from '@lib/popup'

import { LEDGER_ERROR_LOCALES } from '../constants'
import { deriveLedgerError } from '../helpers'

export function handleLedgerError(error: string): void {
    console.error('ERROR:\n', error)
    const ledgerError = deriveLedgerError(error)
    if (ledgerError in LEDGER_ERROR_LOCALES) {
        closePopup(true)
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
