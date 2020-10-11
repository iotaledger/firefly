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
 * Mobile mode
 */
export const mobile = writable<boolean>(false)

/**
 * Dummy
 */
export const loading = writable<boolean>(false)