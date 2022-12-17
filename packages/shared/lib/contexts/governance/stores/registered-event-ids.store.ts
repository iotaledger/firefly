import { writable } from 'svelte/store'

export const registeredEventIds = writable<string[]>([])
