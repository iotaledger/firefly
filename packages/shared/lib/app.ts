import { writable } from 'svelte/store'

import { SendParams } from './typings/sendParams'
import { Unit } from './units'

/**
 * Input parameters for sending transactions
 */
export const sendParams = writable<SendParams>({
    amount: undefined,
    unit: Unit.M,
    address: '',
    message: '',
    isInternal: false,
})
export function clearSendParams(isInternal = false): void {
    sendParams.set({
        amount: undefined,
        unit: Unit.M,
        address: '',
        message: '',
        isInternal,
        toWalletAccount: undefined,
    })
}
