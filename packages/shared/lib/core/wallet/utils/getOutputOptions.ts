import { get } from 'svelte/store'
import type { OutputOptions, Assets } from '@iota/wallet'

import { selectedAccount } from '@core/account'
import { convertDateToUnixTimestamp, Converter } from '@core/utils'
import { IAsset } from '../interfaces'
import { selectedAccountAssets } from '../stores'
import { getLayer2MetadataForTransfer, ILayer2Parameters } from '@core/layer-2'
import { addGasBudget } from '@core/layer-2/utils/addGasBudget'

export function getOutputOptions(
    expirationDate: Date,
    recipientAddress: string,
    rawAmount: string,
    metadata?: string,
    tag?: string,
    asset?: IAsset,
    giftStorageDeposit?: boolean,
    surplus?: string,
    layer2Parameters?: ILayer2Parameters,
    nftId?: string
): OutputOptions {
    const unixTime = expirationDate ? convertDateToUnixTimestamp(expirationDate) : undefined
    const nativeTokenId = asset?.id !== get(selectedAccountAssets)?.baseCoin?.id ? asset?.id : undefined
    const bigAmount = BigInt(rawAmount)

    let amount: string
    if (nativeTokenId && surplus) {
        amount = surplus
    } else {
        amount = nativeTokenId ? '0' : bigAmount.toString()
    }

    tag = Converter.utf8ToHex(tag, true)
    if (layer2Parameters) {
        const { networkAddress, recipient } = layer2Parameters
        amount = addGasBudget(rawAmount)
        metadata = getLayer2MetadataForTransfer(recipient)
        recipientAddress = networkAddress
    } else {
        metadata = Converter.utf8ToHex(metadata, true)
    }

    const assets: Assets = {}
    if (nftId) {
        assets.nftId = nftId
    } else if (nativeTokenId) {
        assets.nativeTokens = [
            {
                id: nativeTokenId,
                amount: '0x' + bigAmount.toString(16),
            },
        ]
    }

    return <OutputOptions>{
        recipientAddress,
        amount,
        features: {
            ...(metadata && { metadata }),
            ...(tag && { tag }),
            ...(layer2Parameters && { sender: get(selectedAccount).depositAddress }),
        },
        unlocks: {
            ...(unixTime && { expirationUnixTime: unixTime }),
        },
        ...((nativeTokenId || nftId) && { assets }),
        storageDeposit: {
            returnStrategy: giftStorageDeposit ? 'Gift' : 'Return',
        },
    }
}
