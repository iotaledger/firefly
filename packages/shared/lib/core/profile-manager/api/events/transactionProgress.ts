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

function handleTransactionProgressInternal(
    payload: TransactionProgressPayload,
    isDuringOnboarding: boolean = false
): void {
    const sendConfirmationProps = get(ledgerSendConfirmationProps)
    const mintNativeTokenConfirmationProps = get(ledgerMintNativeTokenConfirmationProps)

    const _openPopup = (type = 'ledgerTransaction') => {
        const shouldPreventClose = type === 'enableLedgerBlindSigning'

        openPopup({
            type,
            hideClose: shouldPreventClose,
            preventClose: shouldPreventClose,
            ...(sendConfirmationProps
                ? {
                      props: {
                          toAddress:
                              sendConfirmationProps.recipient.type === 'address'
                                  ? sendConfirmationProps.recipient.address
                                  : sendConfirmationProps.recipient.account.depositAddress,
                          toAmount: `${sendConfirmationProps.amount} ${sendConfirmationProps.unit}`,
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
