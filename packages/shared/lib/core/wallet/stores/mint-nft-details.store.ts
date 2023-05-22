import { writable } from 'svelte/store'
import { IMintNftDetails } from '../interfaces'

export const mintNftDetails = writable<IMintNftDetails | undefined>(undefined)

export function setMintNftDetails(payload: IMintNftDetails): void {
    mintNftDetails.set(payload)
}

export function resetMintNftDetails(): void {
    mintNftDetails.set(undefined)
}
