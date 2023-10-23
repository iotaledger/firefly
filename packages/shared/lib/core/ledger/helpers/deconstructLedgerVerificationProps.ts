import { get } from 'svelte/store'

import { PopupProps } from '@auxiliary/popup'
import {
    formatTokenAmountDefault,
    getUnitFromTokenMetadata,
    newTransactionDetails,
    NewTransactionType,
} from '@core/wallet'

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
        const tokenMetadata = transactionDetails?.asset?.metadata
        if (tokenMetadata) {
            const tokenUnit = getUnitFromTokenMetadata(tokenMetadata)
            const tokenAmount = formatTokenAmountDefault(
                Number(transactionDetails?.rawAmount),
                tokenMetadata,
                tokenUnit
            )
            toAmount = `${tokenAmount} ${tokenUnit}`
        }
    }

    return {
        toAddress,
        toAmount,
    }
}
