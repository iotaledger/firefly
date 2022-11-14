import { IAsset } from '@core/wallet'
import { getMarketPriceForAsset } from './getMarketPriceForAsset'

export function getMarketAmountFromAssetValue(rawValue: number, asset: IAsset): number {
    const fiatPrice = getMarketPriceForAsset(asset)
    return (fiatPrice * rawValue) / 10 ** asset?.metadata?.decimals
}
