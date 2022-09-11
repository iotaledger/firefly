import { get } from 'svelte/store'
import { selectedAccountId } from '@core/account'
import { ledgerNanoStatus } from '@core/ledger'
import { isActiveLedgerProfile } from '@core/profile'
import { isOnboardingLedgerProfile } from '@contexts/onboarding'
import { closePopup, openPopup } from '@lib/popup'
import { deconstructLedgerVerificationProps } from '@core/ledger/helpers'

import { MissingTransactionProgressEventPayloadError } from '../../errors'
import { validateWalletApiEvent } from '../../helpers'
import { TransactionProgressEvent } from '../../types'
import { isPreparedTransaction, isPreparedTransactionEssenceHash } from '../../utils'

export function handleTransactionProgressEvent(error: Error, rawEvent: string): void {
    const { accountIndex, payload } = validateWalletApiEvent(error, rawEvent)
    /* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
    handleTransactionProgressEventInternal(accountIndex, payload as TransactionProgressEvent)
}

export function handleTransactionProgressEventInternal(accountIndex: number, payload: TransactionProgressEvent): void {
    if (get(isActiveLedgerProfile)) {
        if (get(selectedAccountId) === accountIndex.toString()) {
            openPopupIfVerificationNeeded(payload)
        }
    } else if (get(isOnboardingLedgerProfile)) {
        openPopupIfVerificationNeeded(payload)
    } else {
        console.warn('Transaction progress handler unimplemented: ', payload)
    }
}

function openPopupIfVerificationNeeded(payload: TransactionProgressEvent): void {
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
