import { INetworkConfig } from '@core/network'
import { ClientOptions } from '@iota/wallet'
import { ChartSelectors } from '@lib/typings/chart'
import { AvailableExchangeRates } from '@lib/typings/currency'

export interface IProfileSettings {
    currency: AvailableExchangeRates
    networkConfig: INetworkConfig
    clientOptions: ClientOptions
    lockScreenTimeoutInMinutes: number
    chartSelectors: ChartSelectors
    hideNetworkStatistics: boolean
}
