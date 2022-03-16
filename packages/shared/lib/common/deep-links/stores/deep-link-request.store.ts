import { writable } from 'svelte/store'

export const isDeepLinkRequestActive = writable<boolean>(false)
