import { writable } from 'svelte/store'
import { Network } from './typings/client'
import type { Node } from './typings/client'
import { isValidUrl, isValidHttpsUrl } from './utils'

export const DEFAULT_NODE: Node = {
    url: 'https://api.hornet-0.testnet.chrysalis2.com',
    username: '',
    password: '',
}

export const DEFAULT_NODES: Node[] = [
    'https://api.hornet-0.testnet.chrysalis2.com',
    'https://api.hornet-1.testnet.chrysalis2.com',
    'https://api.hornet-2.testnet.chrysalis2.com',
    'https://api.hornet-3.testnet.chrysalis2.com'
].map((url) => ({
    url,
    username: '',
    password: '',
}))

/**
 * Selected network during profile creation
 */
export const network = writable<Network>(Network.Mainnet)

/**
 * Check if new node candidate is valid
 * @param {Node[]} nodesList: list of current nodes
 * @param {Node} newNode: new node candidate
 * @returns {boolean}
 */
export const isNewNodeValid = (nodesList: Node[] = null, newNode: Node): boolean => {

    // Remove spaces and trailing slash
    newNode.url = newNode.url.replace(/ /g, '').replace(/\/$/, '');

    // Check if URL is valid
    if (!isValidUrl(newNode.url)) {
        console.error('Node validation error: Invalid url')
        return false;
    }

    // Only allow HTTPS nodes
    if (!isValidHttpsUrl(newNode.url)) {
        console.error('Node validation error: Only https allowed')
        return false;
    }

    // Check whether the node was already added to the list
    if (
        nodesList &&
        nodesList.some(({ url }) => (url.endsWith(':443') ? url.slice(0, -4) : url).match(newNode.url))
    ) {
        console.error('Node validation error: Node already exists')
        return false;
    }

    return true
};