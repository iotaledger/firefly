import { convertDateToUnixTimestamp } from '@core/utils'
import { FeatureTypes, UnlockConditionTypes } from '@iota/types'
import type { BuildNftOutputData } from '@iota/wallet'
import { ADDRESS_TYPE_ED25519, UNLOCK_CONDITION_ADDRESS, UNLOCK_CONDITION_EXPIRATION } from '../constants'
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
            type: UNLOCK_CONDITION_ADDRESS,
            address: {
                type: ADDRESS_TYPE_ED25519,
                pubKeyHash: convertBech32ToHexAddress(recipientAddress),
            },
        },
    ]

    if (expirationDate) {
        const unixTime = convertDateToUnixTimestamp(expirationDate)
        unlockConditions.push({
            type: UNLOCK_CONDITION_EXPIRATION,
            returnAddress: {
                type: ADDRESS_TYPE_ED25519,
                pubKeyHash: convertBech32ToHexAddress(accountAddress),
            },
            unixTime,
        })
    }

    return <BuildNftOutputData>{
        nftId,
        immutableFeatures,
        unlockConditions,
    }
}
