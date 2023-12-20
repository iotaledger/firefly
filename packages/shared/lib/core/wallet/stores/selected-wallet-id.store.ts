import { writable } from 'svelte/store'

// TODO(2.0) Fix all usages
export const selectedWalletId = writable<string>(null)
