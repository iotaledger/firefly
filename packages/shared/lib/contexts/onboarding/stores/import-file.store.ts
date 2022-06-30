import { writable } from 'svelte/store'

export const importFile = writable<ArrayBuffer>(null)
