import { writable } from 'svelte/store'
import { MarketPrices } from '../types'

export const marketPrices = writable<MarketPrices>(undefined)

export function updateMarketPrices(payload: Partial<MarketPrices>): void {
    return marketPrices.update((state) => {
        if (marketPrices) {
            return { ...state, ...payload }
        } else {
            return state
        }
    })
}
