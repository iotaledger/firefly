import { MarketCurrency } from '../enums'

export type MarketCoinPrices = { [key in MarketCurrency]?: number }
