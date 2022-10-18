import { get } from 'svelte/store'

import { localize } from '@core/i18n'
import { resetNewTransactionDetails, resetMintTokenDetails } from '@core/wallet'
import { showAppNotification } from '@lib/notifications'
import { closePopup, openPopup, popupState } from '@auxiliary/popup'

import { LEDGER_ERROR_LOCALES } from '../constants'
import { LedgerError } from '../enums'
import { deriveLedgerError } from '../helpers'

export function handleLedgerError(error: string, resetConfirmationPropsOnDenial: boolean = true): void {
    const ledgerError = deriveLedgerError(error)
    if (ledgerError in LEDGER_ERROR_LOCALES) {
        const popupType = get(popupState)?.type

        const wasDeniedByUser = ledgerError === LedgerError.DeniedByUser

        /**
         * NOTE: We may wish to reset the confirmation props to avoid
         * re-opening the popup if the user manually rejected the prompt
         * on the device.
         */
        if (wasDeniedByUser && resetConfirmationPropsOnDenial) {
            resetNewTransactionDetails()
            resetMintTokenDetails()
        }

        closePopup(true)

        /**
         * NOTE: Because the device has a warning prompt about blind signing when trying it
         * while it's disabled, the user has to manually reject it on the device. This results in
         * an error, however it is bad UX to display it to the user when they meant to do it.
         */
        const hadToEnableBlindSinging = popupType === 'enableLedgerBlindSigning' && wasDeniedByUser
        if (hadToEnableBlindSinging) {
            openPopup({
                type: 'enableLedgerBlindSigning',
            })
        } else {
            showAppNotification({
                type: wasDeniedByUser ? 'warning' : 'error',
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
