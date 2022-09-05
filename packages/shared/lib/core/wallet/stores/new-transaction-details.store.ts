import { writable, Writable } from 'svelte/store'
import type { INewTransactionDetails } from '..'

const defaultTransactionDetails: INewTransactionDetails = {
    amount: '0',
}

export const newTransactionDetails: Writable<INewTransactionDetails> = writable(defaultTransactionDetails)

export function resetNewTransactionDetails(): void {
    newTransactionDetails.set(defaultTransactionDetails)
}

export function updateNewTransactionDetails(payload: Partial<INewTransactionDetails>): void {
    newTransactionDetails.update((state) => ({ ...state, ...payload }))
}

export function setNewTransactionDetails(payload: INewTransactionDetails): void {
    newTransactionDetails.set(payload)
}
