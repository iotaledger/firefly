import { get } from 'svelte/store'
import { IPersistedAsset } from '../interfaces/persisted-asset.interface'
import { assetFilter } from '../stores'

export function isFilteredAsset(asset: IPersistedAsset): boolean {
    const filter = get(assetFilter)
    if (!filter.showHidden.active && asset.hidden) {
        return true
    }
    return false
}
