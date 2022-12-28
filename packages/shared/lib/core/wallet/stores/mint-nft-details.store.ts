import { writable } from 'svelte/store'
import { IMintNftDetails } from '../interfaces'

export const mintNftDetails = writable<IMintNftDetails>({
    standard: undefined,
    version: undefined,
    type: 'image/jpeg',
    uri: undefined,
    amount: '1',
    name: undefined,
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
        standard: undefined,
        version: undefined,
        type: 'image/jpeg',
        uri: undefined,
        amount: '1',
        name: undefined,
        collectionName: undefined,
        royalties: undefined,
        issuerName: undefined,
        description: undefined,
        attributes: undefined,
    })
}
