import { writable } from 'svelte/store'

/**
 * Wallet access pin
 */
export const walletPin = writable<string>(null)
