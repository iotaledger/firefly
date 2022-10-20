import { writable } from 'svelte/store'
import { IMintNftDetails } from '../interfaces'

export const mintNftDetails = writable<IMintNftDetails>({
    id: undefined,
    standard: undefined,
    version: undefined,
    type: undefined,
    uri: undefined,
    name: undefined,
    collectionId: undefined,
    collectionName: undefined,
    royalties: undefined,
    issuerName: undefined,
    description: undefined,
    attributes: undefined,
})

export function setMintNftDetails(payload: IMintNftDetails): void {
    mintNftDetails.set(payload)
}

export function resetMintNftDetails(): void {
    mintNftDetails.set({
        id: undefined,
        standard: undefined,
        version: undefined,
        type: undefined,
        uri: undefined,
        name: undefined,
        collectionId: undefined,
        collectionName: undefined,
        royalties: undefined,
        issuerName: undefined,
        description: undefined,
        attributes: undefined,
    })
}
