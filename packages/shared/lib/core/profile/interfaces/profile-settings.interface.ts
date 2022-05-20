import { INetworkConfig } from '@core/network'
import { ChartSelectors } from '@lib/typings/chart'
import { AvailableExchangeRates } from '@lib/typings/currency'

export interface IProfileSettings {
    currency: AvailableExchangeRates
    networkConfig: INetworkConfig
    lockScreenTimeoutInMinutes: number
    chartSelectors: ChartSelectors
    hideNetworkStatistics: boolean
}
