import { FeatureType, FoundryOutput, MetadataFeature } from '@iota/sdk/out/types'

export function getMetadataFromFoundryOutput(foundry: FoundryOutput): string {
    for (const feature of foundry?.immutableFeatures ?? []) {
        if (feature?.type === FeatureType.Metadata) {
            return (feature as MetadataFeature).data
        }
    }

    for (const feature of foundry?.features ?? []) {
        if (feature?.type === FeatureType.Metadata) {
            return (feature as MetadataFeature).data
        }
    }

    return undefined
}
