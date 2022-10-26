import { INftMetadata } from '../../interfaces'
import type { IMetadataFeature, INftOutput } from '@iota/types'
import { Converter } from '@lib/converter'
import { MimeType } from '@core/wallet/types'
import { FEATURE_TYPE_METADATA } from '@core/wallet/constants'

export function getMetadataFromNftOutput(output: INftOutput): INftMetadata {
    const metadata = output.immutableFeatures?.find(
        (feature) => feature.type === FEATURE_TYPE_METADATA
    ) as IMetadataFeature
    const parsedData = metadata ? JSON.parse(Converter.hexToUtf8(metadata.data)) : {}

    // TODO: Add some validation that everything is correct
    const parsedMetadata: INftMetadata = {
        id: parsedData.id,
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
