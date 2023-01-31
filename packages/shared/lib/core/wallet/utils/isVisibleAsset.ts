import { BooleanFilterOption } from '@core/utils/enums/filters'
import { get } from 'svelte/store'
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
        asset.verification?.status !== filter.verificationStatus.selected
    ) {
        return false
    }
    return true
}
