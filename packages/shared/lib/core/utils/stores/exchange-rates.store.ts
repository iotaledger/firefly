import { writable } from 'svelte/store'

import { DEFAULT_EXCHANGE_RATES } from '../constants'
import { ExchangeRates } from '../types'

export const exchangeRates = writable<ExchangeRates>(DEFAULT_EXCHANGE_RATES)
