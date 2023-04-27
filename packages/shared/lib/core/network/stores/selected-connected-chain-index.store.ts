import { Writable, writable } from 'svelte/store'

export const selectedConnectedChainIndex: Writable<number> = writable(undefined)
