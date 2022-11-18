import { IIrc27Metadata, MimeType } from '@core/nfts'
import { Converter } from '@core/utils/convert'

export function parseNftMetadata(metadata: string): IIrc27Metadata {
    const parsedData = metadata ? JSON.parse(Converter.hexToUtf8(metadata)) : {}

    // TODO: Add some validation that everything is correct
    const parsedMetadata: IIrc27Metadata = {
        standard: parsedData.standard,
        version: parsedData.version,
        type: parsedData.type as MimeType,
        uri: parsedData.uri,
        name: parsedData.name,
        collectionName: parsedData.collectionName,
        royalties: parsedData.royalties,
        issuerName: parsedData.issuerName,
        description: parsedData.description,
        attributes: parsedData.attributes,
    }

    return parsedMetadata
}
