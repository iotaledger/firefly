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
import { DEFAULT_NFT_ENTRY_KEY } from '../../nfts'
import { api } from '@core/api'

export async function buildFoundryOutputData(
    totalSupply: number,
    circulatingSupply: number,
    metadata: IIrc30Metadata,
    accountAddress: string
): Promise<FoundryOutputBuilderParams> {
    const accountId = api.bech32ToHex(accountAddress)
    const unlockConditions: UnlockCondition[] = [
        new ImmutableAccountAddressUnlockCondition(new AccountAddress(accountId)),
    ]
    const tokenScheme = new SimpleTokenScheme(BigInt(circulatingSupply), BigInt(0), BigInt(totalSupply))
    const immutableFeatures: Feature[] = [
        new MetadataFeature({ [DEFAULT_NFT_ENTRY_KEY]: Converter.utf8ToHex(JSON.stringify(metadata)) }),
    ]
    const serialNumber = await getSerialNumberFromAccountAddress(accountId)

    return {
        serialNumber,
        tokenScheme,
        immutableFeatures,
        unlockConditions,
    }
}
