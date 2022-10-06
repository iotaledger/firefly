import { MarketCurrency } from '../enums'

export type MarketPrices = { [key in MarketCurrency]?: number }
