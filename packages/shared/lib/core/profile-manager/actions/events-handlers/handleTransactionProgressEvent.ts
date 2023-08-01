import { get } from 'svelte/store'
import { Event, TransactionProgressWalletEvent, PreparedTransactionEssenceHashProgress } from '@iota/wallet'
import { WalletEventType, TransactionProgressType } from '@iota/wallet/out/types'

import { selectedAccountIndex } from '@core/account'
import { ledgerNanoStatus } from '@core/ledger'
import { isActiveLedgerProfile } from '@core/profile'
import { isOnboardingLedgerProfile } from '@contexts/onboarding'
import { closePopup, openPopup, PopupId } from '@auxiliary/popup'
import { deconstructLedgerVerificationProps } from '@core/ledger/helpers'

import { MissingTransactionProgressEventPayloadError } from '../../errors'
import { TransactionProgressEventPayload } from '../../types'
import { validateWalletApiEvent } from '../../utils'

export function handleTransactionProgressEvent(error: Error, rawEvent: Event): void {
    const { accountIndex, payload } = validateWalletApiEvent(error, rawEvent, WalletEventType.TransactionProgress)
    const type = payload.type
    if (type === WalletEventType.TransactionProgress) {
        const progress = (payload as TransactionProgressWalletEvent).progress
        handleTransactionProgressEventInternal(accountIndex, progress)
    }
}

export function handleTransactionProgressEventInternal(
    accountIndex: number,
    payload: TransactionProgressEventPayload
): void {
    if (get(isActiveLedgerProfile)) {
        if (get(selectedAccountIndex) === accountIndex) {
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
        const type = payload.type
        if (type === TransactionProgressType.PreparedTransaction) {
            openPopup({
                id: PopupId.VerifyLedgerTransaction,
                hideClose: true,
                preventClose: true,
                props: {
                    ...deconstructLedgerVerificationProps(),
                },
            })
        } else if (type === TransactionProgressType.PreparedTransactionEssenceHash) {
            if (get(ledgerNanoStatus)?.blindSigningEnabled) {
                openPopup({
                    id: PopupId.VerifyLedgerTransaction,
                    hideClose: true,
                    preventClose: true,
                    props: {
                        hash: (payload as PreparedTransactionEssenceHashProgress).hash,
                    },
                })
            } else {
                openPopup({
                    id: PopupId.EnableLedgerBlindSigning,
                    hideClose: true,
                    preventClose: true,
                })
            }
        } else if (type === TransactionProgressType.PerformingPow) {
            closePopup(true)
        }
    } else {
        throw new MissingTransactionProgressEventPayloadError()
    }
}
