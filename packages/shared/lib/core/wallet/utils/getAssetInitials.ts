import { IAsset } from '@core/wallet'
import { MAX_ASSET_DISPLAYED_INITIALS } from '@core/wallet/constants'
import { getInitials } from '@lib/helpers'

export function getAssetInitials(asset: IAsset): string {
    return (
        asset?.metadata?.unit?.slice(0, MAX_ASSET_DISPLAYED_INITIALS) ??
        getInitials(asset?.metadata?.name, MAX_ASSET_DISPLAYED_INITIALS)
    )
}
