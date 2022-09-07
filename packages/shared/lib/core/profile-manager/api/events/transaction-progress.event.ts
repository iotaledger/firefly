import { get } from 'svelte/store'
import { selectedAccountId } from '@core/account'
import { ledgerNanoStatus } from '@core/ledger'
import { isActiveLedgerProfile } from '@core/profile'
import {
    MissingTransactionProgressEventPayloadError,
    isPreparedTransaction,
    isPreparedTransactionEssenceHash,
} from '@core/profile-manager'
import { isOnboardingLedgerProfile } from '@contexts/onboarding'
import { closePopup, openPopup } from '@lib/popup'
import { TransactionProgressEventPayload } from '../types'
import { deconstructLedgerVerificationProps } from '@core/ledger/helpers'

export function handleTransactionProgressEvent(accountId: string, payload: TransactionProgressEventPayload): void {
    if (get(isActiveLedgerProfile)) {
        if (get(selectedAccountId) === accountId) {
            openPopupIfVerificationNeeded(payload)
        }
    } else if (get(isOnboardingLedgerProfile)) {
        openPopupIfVerificationNeeded(payload)
    } else {
        console.warn('Transaction progress handler unimplemented: ', payload)
    }
}

function openPopupIfVerificationNeeded(payload: TransactionProgressEventPayload): void {
    if (payload) {
        if (isPreparedTransaction(payload)) {
            openPopup({
                type: 'verifyLedgerTransaction',
                hideClose: true,
                preventClose: true,
                props: {
                    ...deconstructLedgerVerificationProps(),
                },
            })
        } else if (isPreparedTransactionEssenceHash(payload)) {
            if (get(ledgerNanoStatus)?.blindSigningEnabled) {
                openPopup({
                    type: 'verifyLedgerTransaction',
                    hideClose: true,
                    preventClose: true,
                    props: {
                        hash: payload?.['PreparedTransactionEssenceHash'],
                    },
                })
            } else {
                openPopup({
                    type: 'enableLedgerBlindSigning',
                    hideClose: true,
                    preventClose: true,
                })
            }
        } else if (payload === 'PerformingPow') {
            closePopup(true)
        }
    } else {
        throw new MissingTransactionProgressEventPayloadError()
    }
}
