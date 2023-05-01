import { writable } from 'svelte/store'
import { ChainStatuses } from '../types'

export const chainStatuses = writable<ChainStatuses>({})
