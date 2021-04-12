import { stripTrailingSlash } from './helpers'
import type { Node } from './typings/client'
import { isValidHttpsUrl, isValidUrl } from './utils'

export type ExtendedNode = {
    url: string
    auth?: {
        password: string
        username: string
    },
    disabled?: boolean
    isCustom: boolean
    isPrimary: boolean
    networkId: string
}

/**
 * Default timeout for a request made to an endpoint
 */
const DEFAULT_NODE_ENDPOINT_TIMEOUT = 5000

/**
 * TODO retrieve from endpoint
 */
const DEFAULT_NODES: {
    [network: string]: Node[]
} = {
    // mainnet: [
    //     { url: 'https://iota.eco', auth: { username: '', password: '' } },
    // ],
    testnet: [
        { url: 'https://api.hornet-0.testnet.chrysalis2.com', auth: { username: '', password: '' } },
        { url: 'https://api.hornet-1.testnet.chrysalis2.com', auth: { username: '', password: '' } },
        { url: 'https://api.hornet-2.testnet.chrysalis2.com', auth: { username: '', password: '' } },
        { url: 'https://api.hornet-3.testnet.chrysalis2.com', auth: { username: '', password: '' } }
    ]
}

/**
 * Check if a node url is valid
 * @param {Node[]} nodesList: list of current nodes
 * @param {string} newUrl: new node url candidate
 * @param {boolean} allowInSecure: allow the use of plain http
 * @returns {string | undefined}
 */
export const isNodeUrlValid = (nodesList: ExtendedNode[], newUrl: string, allowInSecure: boolean): string | undefined => {
    // Check if URL is valid
    if (!isValidUrl(newUrl)) {
        return 'error.node.invalid'
    }

    // Only allow HTTPS nodes
    if (!allowInSecure && !isValidHttpsUrl(newUrl)) {
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
 * Get the default network
 * @returns The default network
 */
 export const getOfficialDefaultNetwork = (): string => {
     // TODO change for release
     return "testnet"
 }

/**
 * Get the list of official networks
 * @returns The list of networks
 */
export const getOfficialNetworks = (): {label: string; network: string }[] => {
    return [
        // {
        //     label: 'Mainnet',
        //     network: "mainnet",
        // },
        {
            label: 'Testnet',
            network: "testnet",
        }
    ]
}

/**
 * Get the list of official nodes
 * @returns The list of nodes
 */
 export const getOfficialNodes = (network: string): ExtendedNode[] => {
    return (DEFAULT_NODES[network] ?? []).map((n, idx) => ({
        ...n,
        isPrimary: false,
        isCustom: false,
        networkId: network
    }))
}

/**
 * Get the info for a node
 * @param node 
 * @returns 
 */
export const getNodeNetworkInfo = async (url: string): Promise<{
    networkId: string
} | undefined> => {
    const nodeInfoEndpoint = `${stripTrailingSlash(url.replace(/\/+$/, ''))}/api/v1/info`;

    try {
        const requestOptions: RequestInit = {
            headers: {
                Accept: 'application/json',
            },
        }

        const abortController = new AbortController()
        const timerId = setTimeout(
            () => {
                if (abortController) {
                    abortController.abort();
                }
            },
            DEFAULT_NODE_ENDPOINT_TIMEOUT);

        requestOptions.signal = abortController.signal;

        const response = await fetch(nodeInfoEndpoint, requestOptions);

        clearTimeout(timerId)

        const reponseData = await response.json()

        return reponseData?.data
    } catch (err) {
        console.error(err.name === "AbortError" ? new Error(`Could not fetch from ${nodeInfoEndpoint}.`) : err)
    }
}