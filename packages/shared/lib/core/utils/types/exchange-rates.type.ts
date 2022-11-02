import { ExchangeRate } from '../enums'

export type ExchangeRates = {
    [key in ExchangeRate]: number
}
