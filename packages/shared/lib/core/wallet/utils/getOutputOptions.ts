import { convertDateToUnixTimestamp } from '@core/utils'
import type { OutputOptions } from '@iota/wallet'
import { get } from 'svelte/store'
import { IAsset } from '../interfaces'
import { selectedAccountAssets } from '../stores'

export function getOutputOptions(
    expirationDate: Date,
    recipientAddress: string,
    rawAmount: number,
    metadata: string,
    tag: string,
    asset?: IAsset
): OutputOptions {
    const unixTime = expirationDate ? convertDateToUnixTimestamp(expirationDate) : undefined
    const nativeTokenId = asset?.id !== get(selectedAccountAssets).baseCoin.id ? asset?.id : undefined
    return {
        recipientAddress,
        amount: nativeTokenId ? '0' : String(rawAmount),
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
                        amount: '0x' + rawAmount.toString(16),
                    },
                ],
            },
        }),
    }
}
