import { get } from 'svelte/store'
import { OutputOptions, Assets } from '@iota/wallet/out/types'
import { convertDateToUnixTimestamp, Converter } from '@core/utils'
import { getAssetById, NewTransactionType, selectedAccountAssets } from '../stores'
import { addGasBudget, getLayer2MetadataForTransfer } from '@core/layer-2/utils'
import { NewTransactionDetails } from '@core/wallet/types'
import { getAddressFromSubject } from '@core/wallet/utils'
import { ReturnStrategy } from '../enums'

export function getOutputOptions(transactionDetails: NewTransactionDetails): OutputOptions {
    const { recipient, expirationDate, giftStorageDeposit, layer2Parameters } = transactionDetails ?? {}

    const recipientAddress = layer2Parameters ? layer2Parameters.networkAddress : getAddressFromSubject(recipient)

    let amount = getAmountFromTransactionDetails(transactionDetails)
    amount = layer2Parameters ? addGasBudget(amount) : amount

    const assets = getAssetFromTransactionDetails(transactionDetails)

    const tag = Converter.utf8ToHex(transactionDetails?.tag)

    const metadata = layer2Parameters
        ? getLayer2MetadataForTransfer(transactionDetails)
        : Converter.utf8ToHex(transactionDetails?.metadata)

    const expirationUnixTime = expirationDate ? convertDateToUnixTimestamp(expirationDate) : undefined

    return <OutputOptions>{
        recipientAddress,
        amount,
        ...(assets && { assets }),
        features: {
            ...(tag && { tag }),
            ...(metadata && { metadata }),
            ...(layer2Parameters && { sender: layer2Parameters.senderAddress }),
        },
        unlocks: {
            ...(expirationUnixTime && { expirationUnixTime }),
        },
        storageDeposit: {
            returnStrategy: giftStorageDeposit ? ReturnStrategy.Gift : ReturnStrategy.Return,
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
    } else if (transactionDetails.type === NewTransactionType.NftTransfer) {
        rawAmount = transactionDetails?.surplus ?? '0'
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
                        amount: Converter.bigIntToHex(bigAmount),
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
