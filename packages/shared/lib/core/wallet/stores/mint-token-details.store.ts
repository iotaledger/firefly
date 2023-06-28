import { writable } from 'svelte/store'
import { IMintTokenDetails } from '../interfaces'

export const mintTokenDetails = writable<IMintTokenDetails | undefined>(undefined)

export function setMintTokenDetails(payload: IMintTokenDetails): void {
    mintTokenDetails.set(payload)
}

export function resetMintTokenDetails(): void {
    mintTokenDetails.set(undefined)
}
