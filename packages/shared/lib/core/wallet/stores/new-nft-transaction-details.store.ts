import { writable, Writable } from 'svelte/store'
import type { INewNftTransactionDetails } from '..'

export const newNftTransactionDetails: Writable<INewNftTransactionDetails> = writable({
    expirationDate: undefined,
    recipient: undefined,
    immutableFeatures: [],
    nftId: undefined,
})

export function resetNewNftTransactionDetails(): void {
    newNftTransactionDetails.set({
        expirationDate: undefined,
        recipient: undefined,
        immutableFeatures: [],
        nftId: undefined,
    })
}

export function updateNewNftTransactionDetails(payload: Partial<INewNftTransactionDetails>): void {
    newNftTransactionDetails.update((state) => ({ ...state, ...payload }))
}

export function setNewNftTransactionDetails(payload: INewNftTransactionDetails): void {
    newNftTransactionDetails.set(payload)
}
