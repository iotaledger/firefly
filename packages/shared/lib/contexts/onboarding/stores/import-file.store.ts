import { writable } from 'svelte/store'

export const importFile = writable<Buffer>(null)
