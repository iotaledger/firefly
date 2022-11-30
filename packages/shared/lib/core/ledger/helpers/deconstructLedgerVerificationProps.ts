import { get } from 'svelte/store'

import { PopupProps } from '@auxiliary/popup'
import { formatTokenAmountDefault, getPersistedAsset, newTransactionDetails, NewTransactionType } from '@core/wallet'

export function deconstructLedgerVerificationProps(): PopupProps {
    const transactionDetails = get(newTransactionDetails)

    // TODO: Add ledger support for NFTs

    /* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
    const toAddress =
        transactionDetails?.recipient?.type === 'address'
            ? transactionDetails?.recipient?.address
            : transactionDetails?.recipient?.account?.depositAddress
    let toAmount = '0'
    if (transactionDetails.type === NewTransactionType.TokenTransfer) {
        const asset = getPersistedAsset(transactionDetails?.assetId)
        toAmount = `${formatTokenAmountDefault(
            Number(transactionDetails?.rawAmount),
            asset.metadata,
            transactionDetails?.unit
        )}`
    }

    return {
        toAddress,
        toAmount,
    }
}
