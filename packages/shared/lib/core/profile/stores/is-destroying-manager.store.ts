import { writable } from 'svelte/store'

export const isDestroyingManager = writable<boolean>(false)
