import { get } from 'svelte/store'

import { localize } from '@core/i18n'
import { showAppNotification } from '@lib/notifications'
import { closePopup, popupState } from '@lib/popup'
import { PopupType } from '@auxiliary/popup'

import { LEDGER_ERROR_LOCALES } from '../constants'
import { LedgerError } from '../enums'
import { deriveLedgerError } from '../helpers'

export function handleLedgerError(error: string): void {
    console.error('ERROR:\n', error)
    const ledgerError = deriveLedgerError(error)
    if (ledgerError in LEDGER_ERROR_LOCALES) {
        const popupType = get(popupState)?.type

        closePopup()

        /**
         * NOTE: Because the device has a warning prompt about blind signing when trying it
         * while it's disabled, the user has to manually reject it on the device. This results in
         * an error, however it is bad UX to display it to the user when they meant to do it.
         */
        const hadToEnableBlindSinging =
            popupType === PopupType.EnableLedgerBlindSigning && ledgerError === LedgerError.DeniedByUser
        if (!hadToEnableBlindSinging) {
            showAppNotification({
                type: 'error',
                alert: true,
                message: localize(LEDGER_ERROR_LOCALES[ledgerError]),
            })
        }
    } else {
        showAppNotification({
            type: 'error',
            alert: true,
            message: error,
        })
    }
}
