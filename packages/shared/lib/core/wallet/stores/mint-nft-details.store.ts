import { writable } from 'svelte/store'
import { IMintNftDetails } from '../interfaces'

export const mintNftDetails = writable<IMintNftDetails>({
    type: undefined,
    uri: undefined,
    name: undefined,
    collectionId: undefined,
    collectionName: undefined,
    issuerName: undefined,
    description: undefined,
    attribute: undefined,
})

export function setMintNftDetails(payload: IMintNftDetails): void {
    mintNftDetails.set(payload)
}

export function resetMintNftDetails(): void {
    mintNftDetails.set({
        type: undefined,
        uri: undefined,
        name: undefined,
        collectionId: undefined,
        collectionName: undefined,
        issuerName: undefined,
        description: undefined,
        attribute: undefined,
    })
}
