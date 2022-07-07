import { COIN_TYPE } from '@core/network'
import { activeProfile } from '@core/profile'
import { convertDateToUnixTimestamp } from '@core/utils'
import type { OutputOptions } from '@iota/wallet'
import { get } from 'svelte/store'
import { IAsset } from '../interfaces'

export function getOutputOptions(
    expirationDate: Date,
    recipientAddress: string,
    rawAmount: number,
    metadata: string,
    tag: string,
    asset?: IAsset
): OutputOptions {
    const unixTime = expirationDate ? convertDateToUnixTimestamp(expirationDate) : undefined
    const nativeTokenId =
        asset?.id !== COIN_TYPE?.[get(activeProfile)?.networkProtocol]?.toString() ? asset?.id : undefined
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
