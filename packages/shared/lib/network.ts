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
    'https://api.hornet-3.testnet.chrysalis2.com',
].map((url) => ({
    url,
    username: '',
    password: '',
}))

/**
 * Selected network during profile creation
 */
export const network = writable<Network>(Network.Testnet)

/**
 * Check if a node url is valid
 * @param {Node[]} nodesList: list of current nodes
 * @param {Node} newNode: new node candidate
 * @returns {boolean}
 */
export const isNodeValid = (nodesList: Node[] = null, newNode: Node): string | undefined => {
    // Remove spaces, trailing slashes & trailing colons
    newNode.url = newNode.url.replace(/ /g, '').replace(/[^0-9a-zA-Z]*$/, '')

    // Check if URL is valid
    if (!isValidUrl(newNode.url)) {
        return 'error.node.invalid'
    }

    // Only allow HTTPS nodes
    if (!isValidHttpsUrl(newNode.url)) {
        return 'error.node.https'
    }

    const hasDefaultHttpsPort = newNode.url.endsWith(':443')
    if (hasDefaultHttpsPort) {
        newNode.url = newNode.url.slice(0, -4)
    }

    // Check whether the node was already added to the list
    if (nodesList && nodesList.some(({ url }) => (url.endsWith(':443') ? url.slice(0, -4) : url).match(newNode.url))) {
        return 'error.node.duplicate'
    }

    return undefined
}
