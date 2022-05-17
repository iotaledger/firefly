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
 * The last timestamp that the app user was active
 */
export const lastActiveAt = writable<Date>(new Date())

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
 * Determines whether a user is logged in
 */
export const loggedIn = writable<boolean>(false)

/**
 * Cleanup the signup vars
 */
export const cleanupSignup = (): void => {
    mnemonic.set(null)
    strongholdPassword.set(null)
    walletPin.set(null)
}

/**
 * Log in to the current profile
 */
export const login = (): void => {
    loggedIn.set(true)
    lastActiveAt.set(new Date())
}
