import { selectedAccountId } from '@core/account'
import { get } from 'svelte/store'
import { activeProfile } from '@core/profile/stores'
import { ProfileType } from '@core/profile/enums'
import { closePopup, openPopup } from '@lib/popup'
import { ledgerSendConfirmationProps, ledgerDeviceStatus } from '@core/ledger'

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
            const _openPopup = (type = 'ledgerTransaction') => {
                const _props = get(ledgerSendConfirmationProps)
                const shouldPreventClose = type === 'enableLedgerBlindSigning'

                openPopup({
                    type,
                    hideClose: shouldPreventClose,
                    preventClose: shouldPreventClose,
                    props: {
                        toAddress:
                            _props.recipient.type === 'address'
                                ? _props.recipient.address
                                : _props.recipient.account.depositAddress,
                        toAmount: `${_props.amount} ${_props.unit}`,
                        sendConfirmationPopupProps: _props,
                    },
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
