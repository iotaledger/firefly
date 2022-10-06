import { MarketCoinId } from '../enums'
import { MarketPrices } from './market-prices.type'

export type MarketCoinPrices = { [key in MarketCoinId]?: MarketPrices }
