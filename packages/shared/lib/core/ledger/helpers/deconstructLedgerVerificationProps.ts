import { get } from 'svelte/store'

import { PopupProps } from '@auxiliary/popup'
import {
    formatTokenAmountDefault,
    IAccountSubject,
    IAddressSubject,
    newTransactionDetails,
    NewTransactionType,
} from '@core/wallet'

export function deconstructLedgerVerificationProps(): PopupProps {
    const transactionDetails = get(newTransactionDetails)
    const isAddressRecipientType = transactionDetails?.recipient?.type === 'address'

    // TODO: Add ledger support for NFTs

    /* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
    const toAddress = isAddressRecipientType
        ? (transactionDetails?.recipient as IAddressSubject)?.address
        : (transactionDetails?.recipient as IAccountSubject)?.account?.depositAddress

    let toAmount = '0'
    if (transactionDetails.type === NewTransactionType.TokenTransfer) {
        toAmount = `${formatTokenAmountDefault(
            Number(transactionDetails?.rawAmount),
            transactionDetails?.asset.metadata,
            transactionDetails?.unit
        )}`
    }

    return {
        toAddress,
        toAmount,
    }
}
