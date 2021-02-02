import { writable } from 'svelte/store'
import { Network } from './typings/client'

export const DEFAULT_NODES = [
    'https://api.hornet-0.testnet.chrysalis2.com',
    'https://api.hornet-1.testnet.chrysalis2.com',
    'https://api.hornet-2.testnet.chrysalis2.com',
    'https://api.hornet-3.testnet.chrysalis2.com'
];

/**
 * Selected network during profile creation
 */
export const network = writable<Network>(Network.Mainnet)
