import { selectedAccountId } from '@core/account'
import { get } from 'svelte/store'
import { activeProfile } from '@core/profile/stores'
import { ProfileType } from '@core/profile/enums'
import { closePopup, openPopup } from '@lib/popup'
import { ledgerSendConfirmationProps, ledgerDeviceStatus, ledgerMintNativeTokenProps } from '@core/ledger'

export function handleTransactionProgress(
    accountId: string,
    payload:
        | { PreparedTransactionEssenceHash: string }
        | { PreparedTransaction: string }
        | 'PerformingPow'
        | 'SigningTransaction'
): void {
    if (get(selectedAccountId) === accountId) {
        console.warn('Transaction progress handler unimplemented: ', payload)

        if (get(activeProfile).type === ProfileType.Ledger) {
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
                // TODO: Should we double check the type of popup?
                closePopup()
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
    }
}
