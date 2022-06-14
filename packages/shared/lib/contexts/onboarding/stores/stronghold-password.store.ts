import { writable } from 'svelte/store'

/**
 * Stronghold password
 */
export const strongholdPassword = writable<string>(null)
