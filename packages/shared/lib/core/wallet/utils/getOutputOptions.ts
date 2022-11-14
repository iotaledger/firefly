import { get } from 'svelte/store'
import type { OutputOptions, Assets } from '@iota/wallet'

import { selectedAccount } from '@core/account'
import { convertDateToUnixTimestamp, Converter } from '@core/utils'
import { IAsset } from '../interfaces'
import { selectedAccountAssets } from '../stores'
import { ILayer2Parameters } from '@core/network'
import { activeProfile } from '@core/profile'
import { getLayer2Metadata, NETWORK_ADDRESS } from '@core/layer-2'

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

    if (layer2Parameters) {
        const { network, recipient } = layer2Parameters
        metadata = getLayer2Metadata(recipient)
        recipientAddress = NETWORK_ADDRESS[get(activeProfile).networkType][network]
    } else {
        metadata = Converter.utf8ToHex(metadata, true)
    }

    let amount: string
    if (nativeTokenId && surplus) {
        amount = surplus
    } else {
        amount = nativeTokenId ? '0' : bigAmount.toString()
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
