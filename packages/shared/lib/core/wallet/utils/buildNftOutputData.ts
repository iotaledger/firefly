import { AddressUnlockCondition, Ed25519Address, MetadataFeature, NftOutputBuilderParams } from '@iota/sdk/out/types'
import { Converter } from '@core/utils'
import { EMPTY_HEX_ID } from '../constants'
import { convertBech32ToHexAddress } from './convertBech32ToHexAddress'
import { IIrc27Metadata } from '@core/nfts/interfaces'

export function buildNftOutputData(metadata: IIrc27Metadata, address: string): NftOutputBuilderParams {
    const addressUnlockCondition = new AddressUnlockCondition(new Ed25519Address(convertBech32ToHexAddress(address)))

    const unlockConditions: AddressUnlockCondition[] = [addressUnlockCondition]

    const metadataFeature = new MetadataFeature(Converter.utf8ToHex(JSON.stringify(metadata)))

    const immutableFeatures: MetadataFeature[] = [metadataFeature]

    return {
        nftId: EMPTY_HEX_ID,
        immutableFeatures,
        unlockConditions,
    }
}
