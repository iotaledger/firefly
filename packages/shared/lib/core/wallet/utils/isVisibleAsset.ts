import { get } from 'svelte/store'
import { BooleanFilterOption } from '../enums'
import { IPersistedAsset } from '../interfaces/persisted-asset.interface'
import { assetFilter } from '../stores'

// Filters assets based on asset properties. If none of the conditionals are valid, then asset is shown.
export function isVisibleAsset(asset: IPersistedAsset): boolean {
    const filter = get(assetFilter)
    if ((!filter.showHidden.active || filter.showHidden.selected === BooleanFilterOption.No) && asset.hidden) {
        return false
    }
    if (
        filter.verificationStatus.active &&
        filter.verificationStatus.selected &&
        asset.verification !== filter.verificationStatus.selected
    ) {
        return false
    }
    return true
}
