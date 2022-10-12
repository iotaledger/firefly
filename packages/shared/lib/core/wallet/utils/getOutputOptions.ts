import { convertDateToUnixTimestamp } from '@core/utils'
import type { OutputOptions } from '@iota/wallet'
import { get } from 'svelte/store'
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
    surplus?: string
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

    return <OutputOptions>{
        recipientAddress,
        amount,
        features: {
            ...(metadata && { metadata }),
            ...(tag && { tag }),
        },
        unlocks: {
            ...(unixTime && { expirationUnixTime: unixTime }),
        },
        ...(nativeTokenId && {
            assets: {
                nativeTokens: [
                    {
                        id: nativeTokenId,
                        amount: '0x' + bigAmount.toString(16),
                    },
                ],
            },
        }),
        storageDeposit: {
            returnStrategy: giftStorageDeposit ? 'Gift' : 'Return',
        },
    }
}
