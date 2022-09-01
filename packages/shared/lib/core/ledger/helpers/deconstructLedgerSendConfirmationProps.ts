import { get } from 'svelte/store'

import { PopupProps } from '@auxiliary/popup'
import { IAccountSubject, IAddressSubject } from '@core/wallet'

import { ledgerSendConfirmationProps } from '../stores'

export function deconstructLedgerSendConfirmationProps(): PopupProps {
    const sendConfirmationProps = get(ledgerSendConfirmationProps)
    const isAddressRecipientType = sendConfirmationProps?.recipient?.type === 'address'

    /* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
    const toAddress = isAddressRecipientType
        ? (sendConfirmationProps?.recipient as IAddressSubject)?.address
        : (sendConfirmationProps?.recipient as IAccountSubject)?.account?.depositAddress
    const toAmount = `${sendConfirmationProps?.amount} ${sendConfirmationProps?.unit}`

    return {
        toAddress,
        toAmount,
    }
}
