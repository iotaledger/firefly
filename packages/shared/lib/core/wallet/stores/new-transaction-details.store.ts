import { writable, Writable } from 'svelte/store'
import type { NewTransactionDetails } from '../types'

export enum NewTransactionType {
    TokenTransfer = 'TokenTransfer',
    NftTransfer = 'NftTransfer',
}

export const newTransactionDetails: Writable<NewTransactionDetails> = writable({
    type: NewTransactionType.TokenTransfer,
    recipient: undefined,
    rawAmount: undefined,
    assetId: undefined,
    unit: undefined,
})

export function resetNewTokenTransactionDetails(): void {
    newTransactionDetails.set({
        type: NewTransactionType.TokenTransfer,
        recipient: undefined,
        rawAmount: undefined,
        assetId: undefined,
        unit: undefined,
    })
}

export function updateNewTransactionDetails(
    payload: Partial<NewTransactionDetails> & Pick<NewTransactionDetails, 'type'>
): void {
    newTransactionDetails.update((state) => {
        if (payload.type === NewTransactionType.TokenTransfer && state.type === NewTransactionType.TokenTransfer) {
            state = { ...state, ...payload }
        } else if (payload.type === NewTransactionType.NftTransfer && state.type === NewTransactionType.NftTransfer) {
            state = { ...state, ...payload }
        }
        return state
    })
}

export function setNewTransactionDetails(payload: NewTransactionDetails): void {
    newTransactionDetails.set(payload)
}
