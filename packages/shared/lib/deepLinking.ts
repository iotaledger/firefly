import { writable } from 'svelte/store'

/**
 * Indicates that a deep link request is active
 */
export const deepLinkRequestActive = writable<boolean>(false)