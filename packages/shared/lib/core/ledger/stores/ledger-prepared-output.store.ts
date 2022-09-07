import { OutputTypes } from '@iota/types'
import { writable } from 'svelte/store'

export const ledgerPreparedOutput = writable<OutputTypes>(null)
