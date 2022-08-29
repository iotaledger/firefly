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

// TODO: Fix bug where you can click outside of transaction confirmation prompt without confirming, causing
// it to try sending a transaction. Need to prevent the Ledger transaction popup from being closed (can only be closed
// by an action on the Ledger device from the user).

// TODO: Should we uppercase the hash to match the Ledger device?

// TODO: Fix weird popup shit (see what Bego said)

// TODO: Confirm that blind signing transactions don't fuck with your funds (see what happened
// with devnet wallet 1 (988 SMR) and wallet 2 (12 SMR)

function handleTransactionProgressInternal(
    payload: TransactionProgressPayload,
    isDuringOnboarding: boolean = false
): void {
    const sendConfirmationProps = get(ledgerSendConfirmationProps)
    const mintNativeTokenConfirmationProps = get(ledgerMintNativeTokenConfirmationProps)

    const _openPopup = (type = 'ledgerTransaction') => {
        const shouldPreventClose = type === 'enableLedgerBlindSigning'

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
