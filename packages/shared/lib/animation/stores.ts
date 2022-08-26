import { writable } from 'svelte/store'

/**
 * The store tracks the touch interpolation for the mobile header animation
 * 1 = header is visible 0 = header is disappeared
 */
export const mobileHeaderAnimation = writable<number>(1)
