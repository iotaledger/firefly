import { AddressUnlockCondition, Ed25519Address, MetadataFeature, NftOutputBuilderParams } from '@iota/sdk/out/types'
import { Converter } from '@core/utils'
import { DEFAULT_METADATA_FEATURE_ENTRY_KEY, EMPTY_HEX_ID } from '../constants'
import { IIrc27Metadata } from '@core/nfts'
import { AddressConverter } from './AddressConverter'

export function buildNftOutputData(metadata: IIrc27Metadata, address: string): NftOutputBuilderParams {
    const addressUnlockCondition = new AddressUnlockCondition(
        new Ed25519Address(AddressConverter.parseBech32Address(address))
    )

    const unlockConditions: AddressUnlockCondition[] = [addressUnlockCondition]

    const metadataFeature = new MetadataFeature({
        [DEFAULT_METADATA_FEATURE_ENTRY_KEY]: Converter.utf8ToHex(JSON.stringify(metadata)),
    })

    const immutableFeatures: MetadataFeature[] = [metadataFeature]

    return {
        nftId: EMPTY_HEX_ID,
        immutableFeatures,
        unlockConditions,
    }
}
