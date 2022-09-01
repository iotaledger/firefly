import { get } from 'svelte/store'

import { selectedAccountId } from '@core/account'
import { ledgerDeviceStatus, openLedgerConfirmationPopup } from '@core/ledger'
import { isLedgerProfile } from '@core/profile'
import {
    MissingTransactionProgressEventPayloadError,
    isPreparedTransaction,
    isPreparedTransactionEssenceHash,
} from '@core/profile-manager'
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
    if (payload) {
        if (payload === 'PerformingPow') {
            /**
             * NOTE: This is necessary so that the transaction
             * confirmation popup is closed since we can assume
             * the user confirmed the prompt on the actual Ledger
             * device.
             */
            closePopup(true)
        } else if (isPreparedTransaction(payload)) {
            openLedgerConfirmationPopup(payload, isDuringOnboarding)
        } else if (isPreparedTransactionEssenceHash(payload)) {
            if (get(ledgerDeviceStatus)?.blindSigningEnabled) {
                openLedgerConfirmationPopup(payload, isDuringOnboarding)
            } else {
                openPopup({ type: 'enableLedgerBlindSigning' })
            }
        }
    } else {
        throw new MissingTransactionProgressEventPayloadError()
    }
}
