import { writable } from 'svelte/types/runtime/store'

/**
 * The store indicating if Firefly is targeting the mobile platform.
 */
export const mobile = writable<boolean>(false)
