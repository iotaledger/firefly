import { get } from 'svelte/store'
import type { OutputOptions, Assets } from '@iota/wallet'

import { convertDateToUnixTimestamp, Converter } from '@core/utils'
import { getAssetById, NewTransactionType, selectedAccountAssets } from '../stores'
import { getLayer2MetadataForTransfer } from '@core/layer-2'
import { addGasBudget } from '@core/layer-2/utils/addGasBudget'
import { NewTransactionDetails } from '@core/wallet/types'
import { getAddressFromSubject } from '@core/wallet/utils'

export function getOutputOptions(transactionDetails: NewTransactionDetails): OutputOptions {
    const { expirationDate, layer2Parameters, giftStorageDeposit, recipient } = transactionDetails ?? {}

    let amount = getAmountFromTransactionDetails(transactionDetails)
    let metadata = transactionDetails?.metadata
    const tag = Converter.utf8ToHex(transactionDetails?.tag, true)

    let recipientAddress: string
    if (layer2Parameters) {
        amount = addGasBudget(amount)
        recipientAddress = layer2Parameters.networkAddress
        metadata = getLayer2MetadataForTransfer(transactionDetails)
    } else {
        recipientAddress = getAddressFromSubject(recipient)
        metadata = Converter.utf8ToHex(metadata, true)
    }

    const assets = getAssetFromTransactionDetails(transactionDetails)
    const expirationUnixTime = expirationDate ? convertDateToUnixTimestamp(expirationDate) : undefined

    return <OutputOptions>{
        recipientAddress,
        amount,
        features: {
            ...(metadata && { metadata }),
            ...(tag && { tag }),
            ...(layer2Parameters && { sender: layer2Parameters.senderAddress }),
        },
        unlocks: {
            ...(expirationUnixTime && { expirationUnixTime }),
        },
        ...(assets && { assets }),
        storageDeposit: {
            returnStrategy: giftStorageDeposit ? 'Gift' : 'Return',
        },
    }
}

function getAmountFromTransactionDetails(transactionDetails: NewTransactionDetails): string {
    let rawAmount: string

    if (transactionDetails.type === NewTransactionType.TokenTransfer) {
        const asset = getAssetById(transactionDetails.assetId)
        const nativeTokenId = asset?.id === get(selectedAccountAssets)?.baseCoin?.id ? undefined : asset?.id

        if (nativeTokenId) {
            rawAmount = transactionDetails?.surplus ?? '0'
        } else {
            rawAmount = BigInt(transactionDetails.rawAmount).toString()
        }
    } else {
        rawAmount = '0'
    }
    return rawAmount
}

function getAssetFromTransactionDetails(transactionDetails: NewTransactionDetails): Assets {
    let assets: Assets

    if (transactionDetails.type === NewTransactionType.NftTransfer) {
        assets = { nftId: transactionDetails.nftId }
    } else if (transactionDetails.type === NewTransactionType.TokenTransfer) {
        const asset = getAssetById(transactionDetails.assetId)
        const nativeTokenId = asset?.id === get(selectedAccountAssets)?.baseCoin?.id ? undefined : asset?.id

        if (nativeTokenId) {
            const bigAmount = BigInt(transactionDetails.rawAmount)
            assets = {
                nativeTokens: [
                    {
                        id: nativeTokenId,
                        amount: '0x' + bigAmount.toString(16),
                    },
                ],
            }

            // If it's a base coin transaction, we don't need to specify assets
        } else {
            assets = undefined
        }
    } else {
        throw new Error('Invalid transaction type')
    }

    return assets
}
