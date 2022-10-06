import { MarketCoinId } from '../enums'
import { MarketCoinPrices } from './market-coin-prices.type'

export type MarketPrices = { [key in MarketCoinId]?: MarketCoinPrices }
