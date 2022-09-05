import { writable } from 'svelte/store'
import { IMintTokenDetails } from '../interfaces'

export const mintTokenDetails = writable<IMintTokenDetails>({
    name: undefined,
    totalSupply: undefined,
    circulatingSupply: undefined,
    decimals: 0,
    symbol: undefined,
    description: undefined,
    url: undefined,
    logoUrl: undefined,
})

export function updateMintTokenDetails(payload: IMintTokenDetails): void {
    mintTokenDetails.set(payload)
}

export function resetMintTokenDetails(): void {
    mintTokenDetails.set({
        name: undefined,
        totalSupply: undefined,
        circulatingSupply: undefined,
        decimals: 0,
        symbol: undefined,
        description: undefined,
        url: undefined,
        logoUrl: undefined,
    })
}
