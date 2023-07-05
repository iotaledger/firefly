import { get } from 'svelte/store'

import { localize } from '@core/i18n/i18n'
import { resetNewTokenTransactionDetails, resetMintTokenDetails, resetMintNftDetails } from '@core/wallet/stores'
import { IError } from '@core/error/interfaces'
import { handleGenericError } from '@core/error/handlers'
import { showAppNotification } from '@auxiliary/notification'
import { closePopup, openPopup, PopupId, popupState } from '@auxiliary/popup'

import { LEDGER_ERROR_LOCALES } from '../constants'
import { LedgerError } from '../enums'
import { deriveLedgerError } from '../helpers'

export function handleLedgerError(error: IError, resetConfirmationPropsOnDenial = true): void {
    const ledgerError = deriveLedgerError(error?.error)
    if (ledgerError in LEDGER_ERROR_LOCALES) {
        const popupType = get(popupState)?.id

        const wasDeniedByUser = ledgerError === LedgerError.DeniedByUser

        /**
         * NOTE: We may wish to reset the confirmation props to avoid
         * re-opening the popup if the user manually rejected the prompt
         * on the device.
         */
        if (wasDeniedByUser && resetConfirmationPropsOnDenial) {
            resetNewTokenTransactionDetails()
            resetMintTokenDetails()
            resetMintNftDetails()
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
                id: PopupId.EnableLedgerBlindSigning,
            })
        } else {
            showAppNotification({
                type: wasDeniedByUser ? 'warning' : 'error',
                alert: true,
                message: localize(LEDGER_ERROR_LOCALES[ledgerError]),
            })
        }
    } else {
        handleGenericError(error)
    }
}
