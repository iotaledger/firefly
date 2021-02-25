import { writable, get } from 'svelte/store'
import { persistent } from './helpers'
import { resetRouter } from './router'
import { activeProfile } from './profile'
import { destroyActor, resetWallet } from './wallet'
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
export const walletPin = writable<number>(null)

/**
 * Stronghold password
 */
export const strongholdPassword = writable<string>(null)

/**
 * Seed BIP39 mnemonic recovery phrase
 */
export const mnemonic = writable<Array<string>>(null)

interface SendParams {
    amount: number
    address: string
    message: string
}

/**
 * Input paramaters for sending transactions
 */
export const sendParams = writable<SendParams>({ amount: 0, address: '', message: '' })
export const clearSendParams = sendParams.set({ amount: 0, address: '', message: '' })

/**
 * Determines whether a user is logged in
 */
export const loggedIn = writable<boolean>(false)

/**
 * Determines if user can make developer profiles
 */
export const developerMode = persistent<boolean>('developerMode', false)

/**
 * Logout from current profile
 */
export const logout = () => {
    destroyActor(get(activeProfile).id)
    resetWallet()
    resetRouter()
    loggedIn.set(false)
}
