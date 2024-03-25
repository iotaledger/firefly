import { FeatureType, FoundryOutput, MetadataFeature } from '@iota/sdk/out/types'
import { DEFAULT_METADATA_FEATURE_ENTRY_KEY } from '../constants'

export function getMetadataFromFoundryOutput(foundry: FoundryOutput): string | undefined {
    for (const feature of foundry?.immutableFeatures ?? []) {
        if (feature?.type === FeatureType.Metadata) {
            return (feature as MetadataFeature)?.entries?.[DEFAULT_METADATA_FEATURE_ENTRY_KEY]
        }
    }

    for (const feature of foundry?.features ?? []) {
        if (feature?.type === FeatureType.Metadata) {
            return (feature as MetadataFeature)?.entries?.[DEFAULT_METADATA_FEATURE_ENTRY_KEY]
        }
    }

    return undefined
}
