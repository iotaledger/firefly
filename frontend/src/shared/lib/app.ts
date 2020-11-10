import { writable } from 'svelte/store'
import { persistent } from '@shared-lib/helpers'

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

/**
 * App language
 */
export const locale = persistent<string>('locale', null)

/**
 * Dummy
 */
export const logged = persistent<boolean>('logged', false)
