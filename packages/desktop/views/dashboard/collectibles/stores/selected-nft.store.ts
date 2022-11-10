import { writable } from 'svelte/store'

export const selectedNftId = writable<string>(undefined)
