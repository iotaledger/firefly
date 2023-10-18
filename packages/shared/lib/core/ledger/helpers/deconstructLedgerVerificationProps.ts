import { get } from 'svelte/store'

import { PopupProps } from '@auxiliary/popup'
import { formatTokenAmountBestMatch, newTransactionDetails, NewTransactionType } from '@core/wallet'

export function deconstructLedgerVerificationProps(): PopupProps {
    const transactionDetails = get(newTransactionDetails)

    // TODO: Add ledger support for NFTs

    /* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
    const toAddress =
        transactionDetails?.recipient?.type === 'account'
            ? transactionDetails?.recipient?.account?.depositAddress
            : transactionDetails?.recipient?.address
    let toAmount = '0'
    if (transactionDetails?.type === NewTransactionType.TokenTransfer) {
        toAmount = `${formatTokenAmountBestMatch(
            Number(transactionDetails?.rawAmount),
            transactionDetails?.asset?.metadata
        )}`
    }

    return {
        toAddress,
        toAmount,
    }
}
