import type { OutputOptions } from '@iota/wallet'
import { convertDateToUnixTimestamp } from '@core/utils'
import { IAsset } from '../interfaces'
import { COIN_TYPE } from '@core/network'
import { activeProfile } from '@core/profile'
import { get } from 'svelte/store'

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
        ...(!nativeTokenId && { amount: String(rawAmount) }),
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
                        amount: String(rawAmount),
                    },
                ],
            },
        }),
    }
}
