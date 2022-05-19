import { INetworkConfig } from '@core/network'
import { AvailableExchangeRates } from '@lib/typings/currency'
import { ChartSelectors } from '@lib/typings/chart'

export interface IProfileSettings {
    currency: AvailableExchangeRates
    networkConfig: INetworkConfig
    lockScreenTimeoutInMinutes: number
    showHiddenAccounts: boolean
    chartSelectors: ChartSelectors
    hideNetworkStatistics: boolean
}
