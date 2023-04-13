import { MarketCurrency } from '@core/market'

export interface IProfileSettings {
    marketCurrency: MarketCurrency
    lockScreenTimeoutInMinutes: number
    strongholdPasswordTimeoutInMinutes: number
    maxMediaSizeInMegaBytes: number
    maxMediaDownloadTimeInSeconds: number
    hideNetworkStatistics: boolean
}
