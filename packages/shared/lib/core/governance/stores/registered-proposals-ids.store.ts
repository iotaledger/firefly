import { writable } from 'svelte/store'

export const registeredProposalsIds = writable<string[]>([])
