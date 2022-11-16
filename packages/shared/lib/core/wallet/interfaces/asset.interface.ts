import { MarketPrices } from '@core/market'
import { IAssetBalance } from './asset-balance.interface'
import { IPersistedAsset } from './persisted-asset.interface'

export interface IAsset extends IPersistedAsset {
    balance: IAssetBalance
    marketPrices?: MarketPrices
}
