import { writable, Writable } from 'svelte/store'
import { INewTransactionDetails } from '..'

export const newTransactionDetails: Writable<INewTransactionDetails> = writable({})

export function resetNewTransactionDetails(): void {
    newTransactionDetails.set({})
}

export function updateNewTransactionDetails(payload: Partial<INewTransactionDetails>): void {
    newTransactionDetails.update((state) => ({ ...state, ...payload }))
}

export function setNewTransactionDetails(payload: INewTransactionDetails): void {
    newTransactionDetails.set(payload)
}
