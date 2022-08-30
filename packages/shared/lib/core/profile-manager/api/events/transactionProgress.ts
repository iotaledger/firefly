import { selectedAccountId } from '@core/account'
import { get } from 'svelte/store'
import { isLedgerProfile } from '@core/profile'
import { closePopup, openPopup } from '@lib/popup'
import { ledgerDeviceStatus, ledgerMintNativeTokenConfirmationProps, ledgerSendConfirmationProps } from '@core/ledger'

import { TransactionProgressPayload } from '../types'

export function handleTransactionProgress(accountId: string, payload: TransactionProgressPayload): void {
    if (get(isLedgerProfile)) {
        if (get(selectedAccountId) === accountId) {
            handleTransactionProgressInternal(payload)
        }
    } else {
        console.warn('Transaction progress handler unimplemented: ', payload)
    }
}

// TODO: Should we uppercase the hash to match the Ledger device?

function handleTransactionProgressInternal(
    payload: TransactionProgressPayload,
    isDuringOnboarding: boolean = false
): void {
    const sendConfirmationProps = get(ledgerSendConfirmationProps)
    const mintNativeTokenConfirmationProps = get(ledgerMintNativeTokenConfirmationProps)

    const _openPopup = (type = 'ledgerTransaction') => {
        const shouldPreventClose = type === 'enableLedgerBlindSigning' || type === 'ledgerTransaction'

        const isBlindSigningTransaction = typeof payload !== 'string' && 'PreparedTransactionEssenceHash' in payload
        const toAddress = isBlindSigningTransaction
            ? null
            : sendConfirmationProps.recipient.type === 'address'
            ? sendConfirmationProps.recipient.address
            : sendConfirmationProps.recipient.account.depositAddress
        const toAmount = isBlindSigningTransaction
            ? null
            : `${sendConfirmationProps.amount} ${sendConfirmationProps.unit}`
        const hash = isBlindSigningTransaction ? payload?.['PreparedTransactionEssenceHash'] : null

        openPopup({
            type,
            hideClose: shouldPreventClose,
            preventClose: shouldPreventClose,
            ...(sendConfirmationProps
                ? {
                      props: {
                          ...(toAddress && { toAddress }),
                          ...(toAmount && { toAmount }),
                          ...(hash && { hash }),
                          needsToShowPopupAfterwards: !isDuringOnboarding,
                          sendConfirmationPopupProps: sendConfirmationProps,
                      },
                  }
                : {
                      props: {
                          mintNativeTokenConfirmationPopupProps: mintNativeTokenConfirmationProps,
                      },
                  }),
        })
    }

    if (payload === 'PerformingPow') {
        /**
         * NOTE: This is necessary so that the transaction
         * confirmation popup is closed since we can assume
         * the user confirmed the prompt on the actual Ledger
         * device.
         */
        closePopup(true)
    }

    if (typeof payload !== 'string' && 'PreparedTransaction' in payload) {
        _openPopup()
    }

    if (typeof payload !== 'string' && 'PreparedTransactionEssenceHash' in payload) {
        if (!get(ledgerDeviceStatus).blindSigningEnabled) {
            _openPopup('enableLedgerBlindSigning')
        } else {
            _openPopup()
        }
    }
}
