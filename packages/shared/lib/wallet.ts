import { writable } from 'svelte/store'

// TODO: move all this out of the file

export const isTransferring = writable<boolean>(false)
