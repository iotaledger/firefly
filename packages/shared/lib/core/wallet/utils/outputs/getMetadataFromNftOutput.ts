import { FeatureType, MetadataFeature, NftOutput } from '@iota/wallet'

export function getMetadataFromNftOutput(output: NftOutput): string {
    const metadata = output
        .getImmutableFeatures()
        ?.find((feature) => feature.getType() === FeatureType.Metadata) as MetadataFeature
    return metadata?.getData()
}
