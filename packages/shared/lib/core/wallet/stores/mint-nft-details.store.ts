import { IIrc27Metadata } from '@core/nfts'
import { writable } from 'svelte/store'

export const mintNftDetails = writable<IIrc27Metadata>({
    standard: undefined,
    version: undefined,
    type: undefined,
    uri: undefined,
    name: undefined,
    collectionName: undefined,
    royalties: undefined,
    issuerName: undefined,
    description: undefined,
    attributes: undefined,
})

export function setMintNftDetails(payload: IIrc27Metadata): void {
    mintNftDetails.set(payload)
}

export function resetMintNftDetails(): void {
    mintNftDetails.set({
        standard: undefined,
        version: undefined,
        type: undefined,
        uri: undefined,
        name: undefined,
        collectionName: undefined,
        royalties: undefined,
        issuerName: undefined,
        description: undefined,
        attributes: undefined,
    })
}
