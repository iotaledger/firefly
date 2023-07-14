import {
    ImmutableAliasAddressUnlockCondition,
    type BuildFoundryOutputData,
    type UnlockCondition,
    AliasAddress,
    SimpleTokenScheme,
    MetadataFeature,
    Feature,
} from '@iota/wallet'
import { Converter } from '@core/utils'
import { ADDRESS_TYPE_ALIAS, FEATURE_TYPE_METADATA, UNLOCK_CONDITION_IMMUTABLE_ALIAS } from '../constants'
import { IIrc30Metadata } from '../interfaces'
import { convertBech32ToHexAddress } from './convertBech32ToHexAddress'
import { getSerialNumberFromAliasOutput } from './outputs/getSerialNumberFromAliasOutput'

export async function buildFoundryOutputData(
    totalSupply: number,
    circulatingSupply: number,
    metadata: IIrc30Metadata,
    aliasId: string
): Promise<BuildFoundryOutputData> {
    const immutableAliasUnlockCondition = new ImmutableAliasAddressUnlockCondition(
        new AliasAddress(convertBech32ToHexAddress(aliasId))
    )

    const unlockConditions: UnlockCondition[] = [immutableAliasUnlockCondition]

    const tokenScheme = new SimpleTokenScheme(
        Converter.decimalToHex(circulatingSupply),
        Converter.decimalToHex(0),
        Converter.decimalToHex(totalSupply)
    )

    const metadataFeature = new MetadataFeature(Converter.utf8ToHex(JSON.stringify(metadata)))

    const immutableFeatures: Feature[] = [metadataFeature]

    const serialNumber = await getSerialNumberFromAliasOutput(aliasId)

    return {
        serialNumber,
        tokenScheme,
        immutableFeatures,
        unlockConditions,
    }
}
