import { get } from 'svelte/store'

import { selectedAccountId } from '@core/account'
import { ledgerNanoStatus, openLedgerConfirmationPopup } from '@core/ledger'
import { isActiveLedgerProfile } from '@core/profile'
import {
    MissingTransactionProgressEventPayloadError,
    isPreparedTransaction,
    isPreparedTransactionEssenceHash,
} from '@core/profile-manager'
import { isOnboardingLedgerProfile } from '@contexts/onboarding'
import { closePopup, openPopup } from '@lib/popup'

import { TransactionProgressEventPayload } from '../types'

export function handleTransactionProgressEvent(accountId: string, payload: TransactionProgressEventPayload): void {
    if (get(isActiveLedgerProfile)) {
        if (get(selectedAccountId) === accountId) {
            handleTransactionProgressInternal(payload)
        }
    } else if (get(isOnboardingLedgerProfile)) {
        handleTransactionProgressInternal(payload, true)
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
            if (get(ledgerNanoStatus)?.blindSigningEnabled) {
                openLedgerConfirmationPopup(payload, isDuringOnboarding)
            } else {
                openPopup({ type: 'enableLedgerBlindSigning', hideClose: true, preventClose: true })
            }
        }
    } else {
        throw new MissingTransactionProgressEventPayloadError()
    }
}
