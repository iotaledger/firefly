import { writable, Writable } from 'svelte/store'
import { NewTransactionDetails } from '../types/new-transaction-details.type'

export const newTransactionDetails: Writable<NewTransactionDetails> = writable({
    type: 'newToken',
    rawAmount: undefined,
    asset: undefined,
    expirationDate: undefined,
    metadata: undefined,
    recipient: undefined,
    tag: undefined,
    unit: undefined,
    giftStorageDeposit: false,
    surplus: undefined,
    disableToggleGift: false,
    disableChangeExpiration: false,
})

export function setToNewTokenTransactionDetails(): void {
    newTransactionDetails.set({
        type: 'newToken',
        rawAmount: undefined,
        asset: undefined,
        expirationDate: undefined,
        metadata: undefined,
        recipient: undefined,
        tag: undefined,
        unit: undefined,
        giftStorageDeposit: false,
        surplus: undefined,
        disableToggleGift: false,
        disableChangeExpiration: false,
    })
}

export function setToNewNftTransactionDetails(): void {
    newTransactionDetails.set({
        type: 'newNft',
        expirationDate: undefined,
        recipient: undefined,
        immutableFeatures: [],
        giftStorageDeposit: false,
        nftId: undefined,
        surplus: undefined,
        disableToggleGift: false,
        disableChangeExpiration: false,
    })
}

export function updateNewTransactionDetails(
    payload: Partial<NewTransactionDetails> & Pick<NewTransactionDetails, 'type'>
): void {
    newTransactionDetails.update((state) => {
        if (payload.type === 'newToken' && state.type === 'newToken') {
            state = { ...state, ...payload }
        } else if (payload.type === 'newNft' && state.type === 'newNft') {
            state = { ...state, ...payload }
        }
        return state
    })
}

export function setNewTransactionDetails(payload: NewTransactionDetails): void {
    newTransactionDetails.set(payload)
}
