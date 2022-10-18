import { convertDateToUnixTimestamp } from '@core/utils'
import { FeatureTypes, UnlockConditionTypes } from '@iota/types'
import type { BuildNftOutputData } from '@iota/wallet'
import { convertBech32ToHexAddress } from './convertBech32ToHexAddress'

export function buildNftOutputData(
    expirationDate: Date,
    nftId: string,
    immutableFeatures: FeatureTypes[],
    recipientAddress: string,
    accountAddress: string
): BuildNftOutputData {
    const unlockConditions: UnlockConditionTypes[] = [
        {
            type: 0,
            address: {
                type: 0,
                pubKeyHash: convertBech32ToHexAddress(recipientAddress),
            },
        },
    ]

    if (expirationDate) {
        const unixTime = convertDateToUnixTimestamp(expirationDate)
        unlockConditions.push({
            type: 3,
            returnAddress: {
                type: 0,
                pubKeyHash: convertBech32ToHexAddress(accountAddress),
            },
            unixTime,
        })
    }

    return <BuildNftOutputData>{
        nftId: convertBech32ToHexAddress(nftId),
        immutableFeatures,
        unlockConditions,
    }
}
