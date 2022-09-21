import Big from 'big.js'
import { convertDateToUnixTimestamp } from '@core/utils'
import type { OutputOptions } from '@iota/wallet'
import { get } from 'svelte/store'
import { IAsset } from '../interfaces'
import { selectedAccountAssets } from '../stores'

export function getOutputOptions(
    expirationDate: Date,
    recipientAddress: string,
    rawAmount: Big,
    metadata: string,
    tag: string,
    asset?: IAsset,
    giftStorageDeposit?: boolean
): OutputOptions {
    const unixTime = expirationDate ? convertDateToUnixTimestamp(expirationDate) : undefined
    const nativeTokenId = asset?.id !== get(selectedAccountAssets)?.baseCoin?.id ? asset?.id : undefined
    const bigAmount = BigInt(rawAmount.toNumber())
    return <OutputOptions>{
        recipientAddress,
        amount: nativeTokenId ? '0' : bigAmount.toString(),
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
