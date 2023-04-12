import { IPersistedAsset, TokenStandard } from '@core/wallet'
import { MAX_ASSET_DISPLAYED_INITIALS } from '@core/wallet/constants'
import { getInitials } from '@core/utils'

export function getAssetInitials(asset: IPersistedAsset): string {
    const symbol = asset?.metadata.standard === TokenStandard.BaseCoin ? asset?.metadata.unit : asset?.metadata.symbol
    return symbol
        ? symbol?.slice(0, MAX_ASSET_DISPLAYED_INITIALS)
        : getInitials(asset?.metadata?.name, MAX_ASSET_DISPLAYED_INITIALS)
}
