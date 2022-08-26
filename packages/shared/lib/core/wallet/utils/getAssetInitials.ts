import { IPersistedAsset } from '@core/wallet'
import { MAX_ASSET_DISPLAYED_INITIALS } from '@core/wallet/constants'
import { getInitials } from '@lib/helpers'

export function getAssetInitials(asset: IPersistedAsset): string {
    return (
        asset?.metadata?.unit?.slice(0, MAX_ASSET_DISPLAYED_INITIALS) ??
        getInitials(asset?.metadata?.name, MAX_ASSET_DISPLAYED_INITIALS)
    )
}
