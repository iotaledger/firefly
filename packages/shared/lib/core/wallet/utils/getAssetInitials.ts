import { IPersistedAsset, getUnitFromTokenMetadata } from '@core/wallet'
import { MAX_ASSET_DISPLAYED_INITIALS } from '@core/wallet/constants'
import { getInitials } from '@core/utils'

export function getAssetInitials(asset: IPersistedAsset): string {
    const unit = getUnitFromTokenMetadata(asset?.metadata)
    return unit
        ? unit?.slice(0, MAX_ASSET_DISPLAYED_INITIALS)
        : getInitials(asset?.metadata?.name, MAX_ASSET_DISPLAYED_INITIALS)
}
