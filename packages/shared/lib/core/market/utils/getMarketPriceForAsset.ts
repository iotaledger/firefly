import { activeProfile } from '@core/profile'
import { IAsset } from '@core/wallet'
import { get } from 'svelte/store'

export function getMarketPriceForAsset(asset: IAsset): number {
    const marketCurrency = get(activeProfile)?.settings?.marketCurrency
    return asset?.marketPrices?.[marketCurrency]
}
