import { AvailableExchangeRates } from '@lib/typings/currency'

export interface IProfileSettings {
    currency: AvailableExchangeRates
    lockScreenTimeoutInMinutes: number
    hideNetworkStatistics: boolean
}
