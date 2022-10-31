import { convertDateToUnixTimestamp, Converter } from '@core/utils'
import type { FeatureTypes, UnlockConditionTypes } from '@iota/types'
import type { BuildNftOutputData } from '@iota/wallet'
import {
    ADDRESS_TYPE_ED25519,
    FEATURE_TYPE_METADATA,
    FEATURE_TYPE_TAG,
    UNLOCK_CONDITION_ADDRESS,
    UNLOCK_CONDITION_EXPIRATION,
    UNLOCK_CONDITION_STORAGE_DEPOSIT_RETURN,
} from '../constants'
import { convertBech32ToHexAddress } from './convertBech32ToHexAddress'

export function buildNftOutputData(
    expirationDate: Date,
    nftId: string,
    immutableFeatures: FeatureTypes[],
    metadata: string,
    tag: string,
    recipientAddress: string,
    accountAddress: string,
    storageDeposit: string,
    giftStorageDeposit: boolean
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

    if (!giftStorageDeposit && Number(storageDeposit) > 0) {
        unlockConditions.push({
            type: UNLOCK_CONDITION_STORAGE_DEPOSIT_RETURN,
            returnAddress: {
                type: ADDRESS_TYPE_ED25519,
                pubKeyHash: convertBech32ToHexAddress(accountAddress),
            },
            amount: storageDeposit,
        })
    }

    const features: FeatureTypes[] = []
    if (metadata) {
        features.push({ type: FEATURE_TYPE_METADATA, data: Converter.utf8ToHex(metadata, true) })
    }

    if (tag) {
        features.push({ type: FEATURE_TYPE_TAG, tag: Converter.utf8ToHex(tag, true) })
    }

    return <BuildNftOutputData>{
        nftId: convertBech32ToHexAddress(nftId),
        features,
        immutableFeatures,
        unlockConditions,
    }
}
