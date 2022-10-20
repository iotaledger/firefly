import { writable } from 'svelte/store'
import { INftMetadata } from '../interfaces'

export const mintNftDetails = writable<INftMetadata>({
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

export function setMintNftDetails(payload: INftMetadata): void {
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
