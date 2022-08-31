import { get } from 'svelte/store'

import { selectedAccountId } from '@core/account'
import { ledgerDeviceStatus, openLedgerConfirmationPopup } from '@core/ledger'
import { isLedgerProfile } from '@core/profile'
import { isPreparedTransaction, isPreparedTransactionEssenceHash } from '@core/profile-manager'
import { closePopup, openPopup } from '@lib/popup'

import { TransactionProgressEventPayload } from '../types'

export function handleTransactionProgressEvent(accountId: string, payload: TransactionProgressEventPayload): void {
    if (get(isLedgerProfile)) {
        if (get(selectedAccountId) === accountId) {
            handleTransactionProgressInternal(payload)
        }
    } else {
        console.warn('Transaction progress handler unimplemented: ', payload)
    }
}

function handleTransactionProgressInternal(
    payload: TransactionProgressEventPayload,
    isDuringOnboarding?: boolean
): void {
    if (payload === 'PerformingPow') {
        /**
         * NOTE: This is necessary so that the transaction
         * confirmation popup is closed since we can assume
         * the user confirmed the prompt on the actual Ledger
         * device.
         */
        closePopup(true)
    }

    if (isPreparedTransaction(payload)) {
        openLedgerConfirmationPopup(payload, isDuringOnboarding)
    }

    if (isPreparedTransactionEssenceHash(payload)) {
        if (!get(ledgerDeviceStatus).blindSigningEnabled) {
            openPopup({ type: 'enableLedgerBlindSigning' })
        } else {
            openLedgerConfirmationPopup(payload, isDuringOnboarding)
        }
    }
}
