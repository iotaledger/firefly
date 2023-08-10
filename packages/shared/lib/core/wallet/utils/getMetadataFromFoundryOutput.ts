import { FeatureType, FoundryOutput, MetadataFeature } from '@iota/sdk/out/types'

export function getMetadataFromFoundryOutput(foundry: FoundryOutput): string {
    for (const feature of foundry?.getImmutableFeatures() ?? []) {
        if (feature?.type === FeatureType.Metadata) {
            return (feature as MetadataFeature).data
        }
    }

    for (const feature of foundry?.getFeatures() ?? []) {
        if (feature?.type === FeatureType.Metadata) {
            return (feature as MetadataFeature).data
        }
    }
    return undefined
}
