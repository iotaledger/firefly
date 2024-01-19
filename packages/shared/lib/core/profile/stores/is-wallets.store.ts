import { writable } from 'svelte/store'

export const isDestroyingWallets = writable<boolean>(false)
