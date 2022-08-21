import { get } from 'svelte/store'
import { BooleanFilterOption } from '../enums'
import { IPersistedAsset } from '../interfaces/persisted-asset.interface'
import { assetFilter } from '../stores'

export function isFilteredAsset(asset: IPersistedAsset): boolean {
    const filter = get(assetFilter)
    if ((!filter.showHidden.active || filter.showHidden.selected === BooleanFilterOption.No) && asset.hidden) {
        return true
    }
    if (
        filter.verificationStatus.active &&
        filter.verificationStatus.selected &&
        asset.verification !== filter.verificationStatus.selected
    ) {
        return true
    }
    return false
}
