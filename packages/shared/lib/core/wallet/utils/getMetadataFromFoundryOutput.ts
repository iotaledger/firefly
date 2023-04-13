import type { IFoundryOutput } from '@iota/types'

export function getMetadataFromFoundryOutput(foundry: IFoundryOutput): string {
    for (const feature of foundry?.immutableFeatures ?? []) {
        if (feature?.type === 2) {
            return feature.data
        }
    }

    for (const feature of foundry?.features ?? []) {
        if (feature.type === 2) {
            return feature.data
        }
    }
    return undefined
}
