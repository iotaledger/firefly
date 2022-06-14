import { IClientOptions } from '@core/network'
import { ChartSelectors } from '@lib/typings/chart'
import { AvailableExchangeRates } from '@lib/typings/currency'

export interface IProfileSettings {
    currency: AvailableExchangeRates
    clientOptions: IClientOptions
    lockScreenTimeoutInMinutes: number
    chartSelectors: ChartSelectors
    hideNetworkStatistics: boolean
}
