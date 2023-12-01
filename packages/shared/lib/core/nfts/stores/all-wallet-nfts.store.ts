import { writable } from 'svelte/store'

import { INft } from '../interfaces'

export const allWalletNfts = writable<Record<string, INft[]>>({})
