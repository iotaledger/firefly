import { get, writable, Writable } from 'svelte/store'
import { INewTransactionDetails, visibleSelectedAccountAssets } from '..'

const defaultTransactionDetails: INewTransactionDetails = {
    amount: '0',
    asset: get(visibleSelectedAccountAssets)?.baseCoin,
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
