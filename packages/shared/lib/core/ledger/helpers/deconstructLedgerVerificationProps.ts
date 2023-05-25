import { get } from 'svelte/store'

import { PopupProps } from '@overlay'
import { formatTokenAmountDefault, getPersistedAsset, newTransactionDetails, NewTransactionType } from '@core/wallet'

export function deconstructLedgerVerificationProps(): PopupProps {
    const transactionDetails = get(newTransactionDetails)

    // TODO: Add ledger support for NFTs

    /* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
    const toAddress =
        transactionDetails?.recipient?.type === 'account'
            ? transactionDetails?.recipient?.account?.depositAddress
            : transactionDetails?.recipient?.address
    let toAmount = '0'
    if (transactionDetails.type === NewTransactionType.TokenTransfer) {
        const asset = getPersistedAsset(transactionDetails?.assetId)
        toAmount = `${formatTokenAmountDefault(
            Number(transactionDetails?.rawAmount),
            asset?.metadata,
            transactionDetails?.unit
        )}`
    }

    return {
        toAddress,
        toAmount,
    }
}
