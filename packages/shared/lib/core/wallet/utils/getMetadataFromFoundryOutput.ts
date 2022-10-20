import type { IFoundryOutput } from '@iota/types'

export function getMetadataFromFoundryOutput(foundry: IFoundryOutput): string {
    if (foundry?.immutableFeatures?.length > 0) {
        for (const feature of foundry?.immutableFeatures) {
            if (feature.type === 2) {
                return feature.data
            }
        }
    }
    if (foundry?.features?.length > 0) {
        for (const feature of foundry?.features) {
            if (feature.type === 2) {
                return feature.data
            }
        }
    }
    return undefined
}
