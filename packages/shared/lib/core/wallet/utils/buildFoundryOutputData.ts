import {
    type FoundryOutputBuilderParams,
    type UnlockCondition,
    SimpleTokenScheme,
    MetadataFeature,
    Feature,
    ImmutableAccountAddressUnlockCondition,
    AccountAddress,
} from '@iota/sdk/out/types'
import { Converter } from '@core/utils'
import { IIrc30Metadata } from '../interfaces'
import { getSerialNumberFromAccountOutput } from './outputs'
import { api } from '@core/api'

export async function buildFoundryOutputData(
    totalSupply: number,
    circulatingSupply: number,
    metadata: IIrc30Metadata,
    accountId: string
): Promise<FoundryOutputBuilderParams> {
    const immutableAccountUnlockCondition = new ImmutableAccountAddressUnlockCondition(
        new AccountAddress(api.bech32ToHex(accountId))
    )

    const unlockConditions: UnlockCondition[] = [immutableAccountUnlockCondition]

    const tokenScheme = new SimpleTokenScheme(BigInt(circulatingSupply), BigInt(0), BigInt(totalSupply))

    const metadataFeature = new MetadataFeature(Converter.utf8ToHex(JSON.stringify(metadata)))

    const immutableFeatures: Feature[] = [metadataFeature]

    const serialNumber = await getSerialNumberFromAccountOutput(accountId)

    return {
        serialNumber,
        tokenScheme,
        immutableFeatures,
        unlockConditions,
    }
}
