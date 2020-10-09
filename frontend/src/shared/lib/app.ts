import { generateMnemonic } from 'bip39'

import { writable } from 'svelte/store'
import { persistent } from '@shared-lib/helpers'

/**
 * Notification content
 */
export const notification = writable<string>(null)

/**
 * Dark mode enabled state
 */
export const darkMode = persistent<boolean>('darkMode', false)

/**
 * Notification content
 */
export const mobile = writable<boolean>(false)

/**
 * Generate BIP39 Mnemonic Recovery Phrase
 */
export const generateRecoveryPhrase = () => generateMnemonic(256)