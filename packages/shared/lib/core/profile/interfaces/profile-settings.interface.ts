import { ChartSelectors } from '@lib/typings/chart'
import { AvailableExchangeRates } from '@lib/typings/currency'

export interface IProfileSettings {
    currency: AvailableExchangeRates
    lockScreenTimeoutInMinutes: number
    chartSelectors: ChartSelectors
    hideNetworkStatistics: boolean
}
