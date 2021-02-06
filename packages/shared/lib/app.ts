import { writable } from 'svelte/store'
import { persistent } from 'shared/lib/helpers'

/**
 * Notification content
 */
export const notification = writable<string>(null)

/**
 * Mobile mode
 */
export const mobile = writable<boolean>(false)

/**
 * Dark mode enabled state
 */
export const darkMode = persistent<boolean>('darkMode', false)

/**
 * Wallet access pin
 */
export const walletPin = persistent<number>('walletPin', null)

/**
 * Stronghold password
 */
export const strongholdPassword = writable<string>(null)

/**
 * Seed BIP39 mnemonic recovery phrase
 */
export const mnemonic = writable<Array<string>>(null)

interface SendParams {
    amount: number;
    address: string;
    message: string;
}

/**
 * Input paramaters for sending transactions
 */
export const sendParams = writable<SendParams>({ amount: 0, address: '', message: '' })

/**
 * Dummy
 */
export const logged = persistent<boolean>('logged', false)