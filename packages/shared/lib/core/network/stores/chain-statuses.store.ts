import { writable } from 'svelte/store'
import { IChainStatus } from '../interfaces'

export const chainStatuses = writable<{ [chainId: string]: IChainStatus }>({})
