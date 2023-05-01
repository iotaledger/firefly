import { Writable, writable } from 'svelte/store'

export const selectedChainIndex: Writable<number> = writable(undefined)
