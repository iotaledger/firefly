import { getBaseToken } from '@core/profile'
import { writable, Writable } from 'svelte/store'
import type { NewTransactionDetails } from '../types'

export enum NewTransactionType {
    TokenTransfer = 'TokenTransfer',
    NftTransfer = 'NftTransfer',
}

export const newTransactionDetails: Writable<NewTransactionDetails | undefined> = writable(undefined)

export function resetNewTokenTransactionDetails(): void {
    newTransactionDetails.set({
        type: NewTransactionType.TokenTransfer,
        recipient: undefined,
        rawAmount: undefined,
        tokenMetadata: getBaseToken(),
    })
}

export function resetNewTransactionDetails(): void {
    newTransactionDetails.set(undefined)
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
