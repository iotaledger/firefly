import { MarketPrices } from '@core/market'
import { IAssetBalance } from './asset-balance.interface'
import { IPersistedAsset } from './persisted-asset.interface'

export interface IAsset extends IPersistedAsset {
    chainId: number
    balance: IAssetBalance
    marketPrices?: MarketPrices
}
