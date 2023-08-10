import { FeatureType, MetadataFeature, NftOutput } from '@iota/sdk/out/types'

export function getMetadataFromNftOutput(output: NftOutput): string {
    const metadata = output.immutableFeatures?.find(
        (feature) => feature.type === FeatureType.Metadata
    ) as MetadataFeature
    return metadata?.data
}
