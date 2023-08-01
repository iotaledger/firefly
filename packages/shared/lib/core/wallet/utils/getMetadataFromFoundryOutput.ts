import { FeatureType, FoundryOutput, MetadataFeature } from '@iota/wallet/out/types'

export function getMetadataFromFoundryOutput(foundry: FoundryOutput): string {
    for (const feature of foundry?.getImmutableFeatures() ?? []) {
        if (feature?.getType() === FeatureType.Metadata) {
            return (feature as MetadataFeature).getData()
        }
    }

    for (const feature of foundry?.getFeatures() ?? []) {
        if (feature?.getType() === FeatureType.Metadata) {
            return (feature as MetadataFeature).getData()
        }
    }
    return undefined
}
