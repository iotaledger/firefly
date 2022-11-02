import { ExchangeRate } from '@core/utils'

export interface IProfileSettings {
    currency: ExchangeRate
    lockScreenTimeoutInMinutes: number
    hideNetworkStatistics: boolean
}
