import { IAsset } from '@core/wallet'
import { getMarketPriceForAsset } from './getMarketPriceForAsset'

export function getMarketAmountFromAssetValue(amount: number, asset: IAsset): number | undefined {
    const marketPrice = getMarketPriceForAsset(asset)
    if (marketPrice === undefined || asset?.metadata?.decimals === undefined) {
        return undefined
    }

    try {
        const marketAmount = (marketPrice * amount) / 10 ** asset.metadata.decimals
        return marketAmount
    } catch {
        return undefined
    }
}
