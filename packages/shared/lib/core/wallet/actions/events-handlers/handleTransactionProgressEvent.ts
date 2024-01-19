import { get } from 'svelte/store'
import {
    WalletEvent,
    TransactionProgressWalletEvent,
    PreparedTransactionSigningHashProgress,
    WalletEventType,
    TransactionProgressType,
    TransactionProgress,
} from '@iota/sdk/out/types'

import { ledgerNanoStatus } from '@core/ledger'
import { isActiveLedgerProfile } from '@core/profile'
import { isOnboardingLedgerProfile } from '@contexts/onboarding'
import { closePopup, openPopup, PopupId } from '@auxiliary/popup'
import { deconstructLedgerVerificationProps } from '@core/ledger/helpers'
import { validateWalletApiEvent } from '../../utils'
import { selectedWalletId } from '../../stores'
import { MissingTransactionProgressEventPayloadError } from '../../errors'
import { WalletApiEventHandler } from '../../types'

export function handleTransactionProgressEvent(walletId: string): WalletApiEventHandler {
    return (error: Error, rawEvent: WalletEvent) => {
        validateWalletApiEvent(error, rawEvent, WalletEventType.TransactionProgress)
        const type = rawEvent.type
        if (type === WalletEventType.TransactionProgress) {
            const progress = (rawEvent as TransactionProgressWalletEvent).progress
            handleTransactionProgressEventInternal(walletId, progress)
        }
    }
}

export function handleTransactionProgressEventInternal(walletId: string, payload: TransactionProgress): void {
    if (get(isActiveLedgerProfile)) {
        if (get(selectedWalletId) === walletId) {
            openPopupIfVerificationNeeded(payload)
        }
    } else if (get(isOnboardingLedgerProfile)) {
        openPopupIfVerificationNeeded(payload)
    } else {
        console.warn('Transaction progress handler unimplemented: ', payload)
    }
}

function openPopupIfVerificationNeeded(payload: TransactionProgress): void {
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
        } else if (type === TransactionProgressType.PreparedTransactionSigningHash) {
            if (get(ledgerNanoStatus)?.blindSigningEnabled) {
                openPopup({
                    id: PopupId.VerifyLedgerTransaction,
                    hideClose: true,
                    preventClose: true,
                    props: {
                        hash: (payload as PreparedTransactionSigningHashProgress).hash,
                    },
                })
            } else {
                openPopup({
                    id: PopupId.EnableLedgerBlindSigning,
                    hideClose: true,
                    preventClose: true,
                })
            }
            // TODO(2.0): check if this is still needed (PerformingPow)
        } else if (type === TransactionProgressType.PerformingPow) {
            closePopup(true)
        }
    } else {
        throw new MissingTransactionProgressEventPayloadError()
    }
}
