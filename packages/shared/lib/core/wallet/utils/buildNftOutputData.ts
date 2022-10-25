import { convertDateToUnixTimestamp } from '@core/utils'
import { FeatureTypes, UnlockConditionTypes } from '@iota/types'
import type { BuildNftOutputData } from '@iota/wallet'
import {
    ADDRESS_TYPE_ED25519,
    UNLOCK_CONDITION_ADDRESS,
    UNLOCK_CONDITION_EXPIRATION,
    UNLOCK_CONDITION_STORAGE_DEPOSIT_RETURN,
} from '../constants'
import { convertBech32ToHexAddress } from './convertBech32ToHexAddress'

export function buildNftOutputData(
    expirationDate: Date,
    nftId: string,
    immutableFeatures: FeatureTypes[],
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

    return <BuildNftOutputData>{
        nftId: convertBech32ToHexAddress(nftId),
        immutableFeatures,
        unlockConditions,
    }
}
