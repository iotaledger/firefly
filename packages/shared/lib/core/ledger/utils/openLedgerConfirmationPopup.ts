import { PopupProps } from '@auxiliary/popup'
import { isPreparedTransaction, isPreparedTransactionEssenceHash } from '@core/profile-manager'
import { TransactionProgressEventPayload } from '@core/profile-manager/api/types'
import { openPopup } from '@lib/popup'

import { deconstructLedgerSendConfirmationProps } from '../helpers'

export function openLedgerConfirmationPopup(
    payload: TransactionProgressEventPayload,
    isDuringOnboarding?: boolean
): void {
    let props: PopupProps
    if (isPreparedTransaction(payload)) {
        props = {
            ...deconstructLedgerSendConfirmationProps(),
            needsToShowPopupAfterwards: !isDuringOnboarding,
        }
    } else if (isPreparedTransactionEssenceHash(payload)) {
        props = { hash: payload['PreparedTransactionEssenceHash'] }
    }

    if (props) {
        openPopup({
            type: 'verifyLedgerTransaction',
            hideClose: true,
            preventClose: true,
            props,
        })
    }
}
