import { PopupProps } from '@auxiliary/popup'
import { isPreparedTransaction, isPreparedTransactionEssenceHash } from '@core/profile-manager'
import { TransactionProgressEventPayload } from '@core/profile-manager/api/types'
import { openPopup } from '@lib/popup'

import { deconstructLedgerSendConfirmationProps } from '../helpers'

export function openLedgerConfirmationPopup(
    payload?: TransactionProgressEventPayload,
    isDuringOnboarding?: boolean
): void {
    if (!payload) {
        return
    } else {
        let props: PopupProps
        switch (true) {
            case isPreparedTransaction(payload):
                props = {
                    ...deconstructLedgerSendConfirmationProps(),
                    needsToShowPopupAfterwards: !isDuringOnboarding,
                }
                break
            case isPreparedTransactionEssenceHash(payload):
                props = { hash: payload?.['PreparedTransactionEssenceHash'] }
                break
            default:
                break
        }

        openPopup({
            type: 'ledgerTransaction',
            hideClose: true,
            preventClose: true,
            props,
        })
    }
}
