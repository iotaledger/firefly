import type { FeatureTypes, TokenSchemeTypes, UnlockConditionTypes } from '@iota/types'
import type { BuildFoundryOutputData } from '@iota/wallet'
import { Converter } from '@core/utils'
import { ADDRESS_TYPE_ALIAS, FEATURE_TYPE_METADATA, UNLOCK_CONDITION_IMMUTABLE_ALIAS } from '../constants'
import type { IIrc30Metadata } from '../interfaces'
import { convertBech32ToHexAddress } from './convertBech32ToHexAddress'

export function buildFoundryOutputData(
    totalSupply: number,
    circulatingSupply: number,
    metadata: IIrc30Metadata,
    aliasId: string
): BuildFoundryOutputData {
    const unlockConditions: UnlockConditionTypes[] = [
        {
            type: UNLOCK_CONDITION_IMMUTABLE_ALIAS,
            address: {
                type: ADDRESS_TYPE_ALIAS,
                aliasId: convertBech32ToHexAddress(aliasId),
            },
        },
    ]
    const tokenScheme: TokenSchemeTypes = {
        type: 0,
        maximumSupply: Converter.decimalToHex(totalSupply),
        meltedTokens: Converter.decimalToHex(0),
        mintedTokens: Converter.decimalToHex(circulatingSupply),
    }

    const immutableFeatures: FeatureTypes[] = [
        {
            type: FEATURE_TYPE_METADATA,
            data: Converter.utf8ToHex(JSON.stringify(metadata)),
        },
    ]

    return {
        serialNumber: 0,
        tokenScheme,
        immutableFeatures,
        unlockConditions,
    }
}
