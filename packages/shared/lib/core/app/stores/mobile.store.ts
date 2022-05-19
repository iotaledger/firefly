import { writable } from 'svelte/store'

/**
 * Mobile mode
 */
export const mobile = writable<boolean>(false)
