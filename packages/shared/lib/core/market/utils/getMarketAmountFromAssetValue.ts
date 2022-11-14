import { IAsset } from '@core/wallet'
import { getMarketPriceForAsset } from './getMarketPriceForAsset'

export function getMarketAmountFromAssetValue(amount: number, asset: IAsset): number {
    const marketPrice = getMarketPriceForAsset(asset)
    return (marketPrice * amount) / 10 ** asset?.metadata?.decimals
}
