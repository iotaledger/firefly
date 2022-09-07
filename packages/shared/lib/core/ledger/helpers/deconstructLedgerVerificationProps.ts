import { get } from 'svelte/store'

import { PopupProps } from '@auxiliary/popup'
import { IAccountSubject, IAddressSubject, newTransactionDetails } from '@core/wallet'

export function deconstructLedgerVerificationProps(): PopupProps {
    const transactionDetails = get(newTransactionDetails)
    const isAddressRecipientType = transactionDetails?.recipient?.type === 'address'

    /* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
    const toAddress = isAddressRecipientType
        ? (transactionDetails?.recipient as IAddressSubject)?.address
        : (transactionDetails?.recipient as IAccountSubject)?.account?.depositAddress
    const toAmount = `${transactionDetails?.amount} ${transactionDetails?.unit}`

    return {
        toAddress,
        toAmount,
    }
}
