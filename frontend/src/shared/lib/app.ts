import { writable } from 'svelte/store'
import { persistent } from './helpers'

/**
 * Notification content
 */
export const notification = writable<string>(null)

/**
 * Dark mode enabled state
 */
export const darkMode = persistent<boolean>('darkMode', false)