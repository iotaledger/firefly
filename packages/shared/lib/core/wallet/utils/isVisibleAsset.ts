import { BooleanFilterOption } from '@core/utils/enums/filters'
import { get } from 'svelte/store'
import { AssetFilter, IAsset } from '../interfaces'
import { assetFilter } from '../stores'

// Filters assets based on asset properties. If none of the conditionals are valid, then asset is shown.
export function isVisibleAsset(asset: IAsset): boolean {
    const filter = get(assetFilter)
    if (!isVisibleWithActiveHiddenFilter(asset, filter)) {
        return false
    }
    if (!isVisibleWithActiveVerificationStatusFilter(asset, filter)) {
        return false
    }
    return true
}

function isVisibleWithActiveHiddenFilter(asset: IAsset, filter: AssetFilter): boolean {
    if ((!filter.showHidden.active || filter.showHidden.selected === BooleanFilterOption.No) && asset.hidden) {
        return false
    }
    return true
}

function isVisibleWithActiveVerificationStatusFilter(asset: IAsset, filter: AssetFilter): boolean {
    if (
        filter.verificationStatus.active &&
        filter.verificationStatus.selected &&
        asset.verification?.status !== filter.verificationStatus.selected
    ) {
        return false
    }
    return true
}
