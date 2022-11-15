import { writable } from 'svelte/store'
import { MarketCoinPrices } from '../types'

export const marketCoinPrices = writable<MarketCoinPrices>(undefined)

export function updateMarketCoinPrices(payload: Partial<MarketCoinPrices>): void {
    return marketCoinPrices.update((state) => {
        if (payload) {
            return { ...state, ...payload }
        } else {
            return state
        }
    })
}
