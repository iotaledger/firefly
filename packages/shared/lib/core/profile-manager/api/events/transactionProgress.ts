import { selectedAccountId } from '@core/account'
import { get } from 'svelte/store'
import { isActiveLedgerProfile } from '@core/profile/stores'
import { closePopup, openPopup } from '@lib/popup'
import { ledgerDeviceStatus, ledgerMintNativeTokenProps, ledgerSendConfirmationProps } from '@core/ledger'
import { isOnboardingLedgerProfile } from '@contexts/onboarding'

type BlindTransaction = { PreparedTransactionEssenceHash: string }
type RegularTransaction = { PreparedTransaction: string }

type TransactionProgressPayload = 'PerformingPow' | 'SigningTransaction' | RegularTransaction | BlindTransaction

export function handleTransactionProgress(accountId: string, payload: TransactionProgressPayload): void {
    if (get(isOnboardingLedgerProfile)) {
        handleTransactionProgressInternal(payload, true)
    } else if (get(isActiveLedgerProfile)) {
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
    const _sendConfirmationProps = get(ledgerSendConfirmationProps)
    const _mintNativeTokenProps = get(ledgerMintNativeTokenProps)

    const _openPopup = (type = 'ledgerTransaction') => {
        const shouldPreventClose = type === 'enableLedgerBlindSigning'

        openPopup({
            type,
            hideClose: shouldPreventClose,
            preventClose: shouldPreventClose,
            ...(_sendConfirmationProps
                ? {
                      props: {
                          toAddress:
                              _sendConfirmationProps.recipient.type === 'address'
                                  ? _sendConfirmationProps.recipient.address
                                  : _sendConfirmationProps.recipient.account.depositAddress,
                          toAmount: `${_sendConfirmationProps.amount} ${_sendConfirmationProps.unit}`,
                          needsToShowPopupAfterwards: !isDuringOnboarding,
                          sendConfirmationPopupProps: _sendConfirmationProps,
                      },
                  }
                : {
                      props: {
                          mintNativeTokenPopupProps: _mintNativeTokenProps,
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
