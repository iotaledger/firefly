import type { FeatureTypes, UnlockConditionTypes } from '@iota/types'
import type { BuildNftOutputData } from '@iota/wallet'
import { Converter } from '@core/utils'
import { ADDRESS_TYPE_ED25519, EMPTY_HEX_ID, FEATURE_TYPE_METADATA, UNLOCK_CONDITION_ADDRESS } from '../constants'
import { convertBech32ToHexAddress } from './convertBech32ToHexAddress'
import type { IIrc27Metadata } from '@core/nfts/interfaces'

export function buildNftOutputData(metadata: IIrc27Metadata, address: string): BuildNftOutputData {
    const unlockConditions: UnlockConditionTypes[] = [
        {
            type: UNLOCK_CONDITION_ADDRESS,
            address: {
                type: ADDRESS_TYPE_ED25519,
                pubKeyHash: convertBech32ToHexAddress(address),
            },
        },
    ]

    const immutableFeatures: FeatureTypes[] = [
        {
            type: FEATURE_TYPE_METADATA,
            data: Converter.utf8ToHex(JSON.stringify(metadata)),
        },
    ]

    return {
        nftId: EMPTY_HEX_ID,
        immutableFeatures,
        unlockConditions,
    }
}
