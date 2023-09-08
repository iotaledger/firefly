import {
    ImmutableAliasAddressUnlockCondition,
    type FoundryOutputBuilderParams,
    type UnlockCondition,
    AliasAddress,
    SimpleTokenScheme,
    MetadataFeature,
    Feature,
} from '@iota/sdk/out/types'
import { Converter } from '@core/utils'
import { IIrc30Metadata } from '../interfaces'
import { getSerialNumberFromAliasOutput } from './outputs/getSerialNumberFromAliasOutput'
import { api } from '@core/profile-manager'

export async function buildFoundryOutputData(
    totalSupply: number,
    circulatingSupply: number,
    metadata: IIrc30Metadata,
    aliasId: string
): Promise<FoundryOutputBuilderParams> {
    const immutableAliasUnlockCondition = new ImmutableAliasAddressUnlockCondition(
        new AliasAddress(api.bech32ToHex(aliasId))
    )

    const unlockConditions: UnlockCondition[] = [immutableAliasUnlockCondition]

    const tokenScheme = new SimpleTokenScheme(BigInt(circulatingSupply), BigInt(0), BigInt(totalSupply))

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
