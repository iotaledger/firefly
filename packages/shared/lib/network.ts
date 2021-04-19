import { writable } from 'svelte/store'
import type { Node } from './typings/client'
import { Network } from './typings/client'
import { isValidHttpsUrl, isValidUrl } from './utils'

const DEFAULT_NODES: Node[] = [
    'https://api.lb-0.migration4.iotatestmigration4.net/'
].map((url) => ({
    url,
    auth: {
        username: '',
        password: ''
    }
}))

/**
 * Selected network during profile creation
 */
export const network = writable<Network>(Network.Testnet)

/**
 * Check if a node url is valid
 * @param {Node[]} nodesList: list of current nodes
 * @param {string} newUrl: new node url candidate
 * @returns {string | undefined}
 */
export const isNodeUrlValid = (nodesList: Node[], newUrl: string): string | undefined => {
    // Check if URL is valid
    if (!isValidUrl(newUrl)) {
        return 'error.node.invalid'
    }

    // Only allow HTTPS nodes
    if (!isValidHttpsUrl(newUrl)) {
        return 'error.node.https'
    }

    const hasDefaultHttpsPort = newUrl.endsWith(':443')
    if (hasDefaultHttpsPort) {
        newUrl = newUrl.slice(0, -4)
    }

    // Check whether the node was already added to the list
    if (nodesList && nodesList.some(({ url }) => (url.endsWith(':443') ? url.slice(0, -4) : url).match(newUrl))) {
        return 'error.node.duplicate'
    }

    return undefined
}


/**
 * Get the list of official nodes
 * @returns The list of nodes
 */
export const getOfficialNodes = () => {
    return DEFAULT_NODES
}