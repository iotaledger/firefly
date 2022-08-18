import { selectedAccountId } from '@core/account'
import { get } from 'svelte/store'
import { activeProfile } from '@core/profile/stores'
import { ProfileType } from '@core/profile/enums'
import { closePopup, openPopup } from '@lib/popup'
import { ledgerSendConfirmationProps } from '@core/ledger'

export function handleTransactionProgress(
    accountId: string,
    payload: { PreparedTransactionEssenceHash: string } | 'PerformingPow' | 'SigningTransaction'
): void {
    if (get(selectedAccountId) === accountId) {
        console.warn('Transaction progress handler unimplemented: ', payload)

        if (get(activeProfile).type === ProfileType.Ledger) {
            if (payload === 'PerformingPow') {
                // TODO: Should we double check the type of popup?
                closePopup()
            }

            if (payload === 'SigningTransaction') {
                const _props = get(ledgerSendConfirmationProps)

                openPopup({
                    type: 'ledgerTransaction',
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

            if (typeof payload !== 'string' && 'PreparedTransactionEssenceHash' in payload) {
                closePopup()
            }
        }
    }
}
