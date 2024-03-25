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
import { getSerialNumberFromAccountAddress } from './outputs'
import { DEFAULT_METADATA_FEATURE_ENTRY_KEY } from '../constants'
import { AddressConverter } from './AddressConverter'

export async function buildFoundryOutputData(
    totalSupply: number,
    circulatingSupply: number,
    metadata: IIrc30Metadata,
    accountAddress: string
): Promise<FoundryOutputBuilderParams> {
    const accountId = AddressConverter.parseBech32Address(accountAddress)
    const unlockConditions: UnlockCondition[] = [
        new ImmutableAccountAddressUnlockCondition(new AccountAddress(accountId)),
    ]
    const tokenScheme = new SimpleTokenScheme(BigInt(circulatingSupply), BigInt(0), BigInt(totalSupply))
    const immutableFeatures: Feature[] = [
        new MetadataFeature({ [DEFAULT_METADATA_FEATURE_ENTRY_KEY]: Converter.utf8ToHex(JSON.stringify(metadata)) }),
    ]
    const serialNumber = await getSerialNumberFromAccountAddress(accountId)

    return {
        serialNumber,
        tokenScheme,
        immutableFeatures,
        unlockConditions,
    }
}
