import { Unit } from '@iota/unit-converter'
import { SendParams } from 'shared/lib/typings/sendParams'
import { writable } from 'svelte/store'

/**
 * Wallet access pin
 */
export const walletPin = writable<string>(null)

/**
 * Stronghold password
 */
export const strongholdPassword = writable<string>(null)

/**
 * Seed BIP39 mnemonic recovery phrase
 */
export const mnemonic = writable<string[]>(null)

/**
 * Input parameters for sending transactions
 */
export const sendParams = writable<SendParams>({
    amount: undefined,
    unit: Unit.Mi,
    address: '',
    message: '',
    isInternal: false,
})
export const clearSendParams = (isInternal = false): void =>
    sendParams.set({
        amount: undefined,
        unit: Unit.Mi,
        address: '',
        message: '',
        isInternal,
        toWalletAccount: undefined,
    })

/**
 * Cleanup the signup vars
 */
export const cleanupSignup = (): void => {
    mnemonic.set(null)
    strongholdPassword.set(null)
    walletPin.set(null)
}
