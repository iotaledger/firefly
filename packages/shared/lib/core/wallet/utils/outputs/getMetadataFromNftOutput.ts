import { Converter } from '@core/utils/convert'
import { FEATURE_TYPE_ISSUER, FEATURE_TYPE_METADATA } from '@core/wallet/constants'
import { MimeType } from '@core/wallet/types'
import type { AddressTypes, IIssuerFeature, IMetadataFeature, INftOutput } from '@iota/types'
import { IIrc27Metadata } from '../../interfaces'

export function getMetadataFromNftOutput(output: INftOutput): string {
    const metadata = output.immutableFeatures?.find(
        (feature) => feature.type === FEATURE_TYPE_METADATA
    ) as IMetadataFeature
    return metadata?.data
}

export function getIssuerFromNftOutput(output: INftOutput): AddressTypes {
    const metadata = output.immutableFeatures?.find((feature) => feature.type === FEATURE_TYPE_ISSUER) as IIssuerFeature
    return metadata?.address
}

export function parseNftMetadata(metadata: string): IIrc27Metadata {
    const parsedData = metadata ? JSON.parse(Converter.hexToUtf8(metadata)) : {}

    // TODO: Add some validation that everything is correct
    const parsedMetadata: IIrc27Metadata = {
        standard: parsedData.standard,
        version: parsedData.version,
        type: parsedData.type as MimeType,
        uri: parsedData.uri,
        name: parsedData.name,
        collectionId: parsedData.collectionId,
        collectionName: parsedData.collectionName,
        royalties: parsedData.royalties,
        issuerName: parsedData.issuerName,
        description: parsedData.description,
        attributes: parsedData.attributes,
    }

    return parsedMetadata
}
