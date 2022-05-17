import { writable } from 'svelte/store'

export const selectedAccountId = writable<string>(null)
