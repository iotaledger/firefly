import { MarketCurrency } from '@core/market'

export interface IProfileSettings {
    marketCurrency: MarketCurrency
    lockScreenTimeoutInMinutes: number
    hideNetworkStatistics: boolean
}
