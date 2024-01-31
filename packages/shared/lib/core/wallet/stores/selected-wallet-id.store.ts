import { writable } from 'svelte/store'

export const selectedWalletId = writable<string>(null)
