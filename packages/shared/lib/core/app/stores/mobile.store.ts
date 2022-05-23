import { writable } from 'svelte/store'

/**
 * The store containing a boolean flag for if the application is targeting mobile platforms.
 */
export const mobile = writable<boolean>(false)
