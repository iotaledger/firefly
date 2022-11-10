import { get } from 'svelte/store'
import { selectedAccountIndex } from '@core/account'
import { ledgerNanoStatus } from '@core/ledger'
import { isActiveLedgerProfile } from '@core/profile'
import { isOnboardingLedgerProfile } from '@contexts/onboarding'
import { closePopup, openPopup } from '@auxiliary/popup'
import { deconstructLedgerVerificationProps } from '@core/ledger/helpers'

import { WalletApiEvent } from '../../enums'
import { MissingTransactionProgressEventPayloadError } from '../../errors'
import { isPreparedTransaction, isPreparedTransactionEssenceHash } from '../../helpers'
import { TransactionProgressEventPayload } from '../../types'
import { validateWalletApiEvent } from '../../utils'

export function handleTransactionProgressEvent(error: Error, rawEvent: string): void {
    const { accountIndex, payload } = validateWalletApiEvent(error, rawEvent, WalletApiEvent.TransactionProgress)
    /* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
    handleTransactionProgressEventInternal(accountIndex, payload as TransactionProgressEventPayload)
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
