import { writable } from 'svelte/store'

/**
 * A store variable that indicates whether a deep link request is currently active.
 */
export const isDeepLinkRequestActive = writable<boolean>(false)
