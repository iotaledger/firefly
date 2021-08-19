import type { Node } from './typings/node'
import { isValidHttpsUrl, isValidUrl } from './utils'
import { Network } from './typings/network'

const DEFAULT_NETWORK: Network = Network.ChrysalisMainnet

const DEFAULT_NODES: Node[] = ['https://chrysalis-nodes.iota.org', 'https://chrysalis-nodes.iota.cafe'].map((url) => ({
    url,
    auth: {
        username: '',
        password: '',
    },
}))

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
export const getOfficialNodes = (): Node[] => DEFAULT_NODES

/**
 * Get the official network
 * @returns The official network
 */
export const getOfficialNetwork = (): string => DEFAULT_NETWORK
