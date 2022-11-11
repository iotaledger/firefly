import { get } from 'svelte/store'
import type { OutputOptions, Assets } from '@iota/wallet'

import { selectedAccount } from '@core/account'
import { convertDateToUnixTimestamp } from '@core/utils'
import { IAsset } from '../interfaces'
import { selectedAccountAssets } from '../stores'

export function getOutputOptions(
    expirationDate: Date,
    recipientAddress: string,
    rawAmount: string,
    metadata?: string,
    tag?: string,
    asset?: IAsset,
    giftStorageDeposit?: boolean,
    surplus?: string,
    nftId?: string,
    addSenderFeature?: boolean
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
            ...(addSenderFeature && { sender: get(selectedAccount).depositAddress }),
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
