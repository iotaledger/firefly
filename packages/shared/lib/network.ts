import type { Node, NodeAuth } from './typings/node'
import { isValidHttpsUrl, isValidUrl } from './utils'
import type { Network, NetworkConfig } from './typings/network'
import { NetworkType } from './typings/network'
import { api, wallet } from './wallet'
import { isNewNotification, showAppNotification } from './notifications'
import { localize } from './i18n'
import type { ClientOptions } from './typings/client'
import { get } from 'svelte/store'
import { activeProfile } from './profile'

export const CHRYSALIS_MAINNET_ID = 'chrysalis-mainnet'
export const CHRYSALIS_MAINNET_NAME = 'Chrysalis Mainnet'
export const CHRYSALIS_MAINNET_BECH32_HRP = 'iota'
export const CHRYSALIS_DEVNET_ID = 'chrysalis-devnet'
export const CHRYSALIS_DEVNET_NAME = 'Chrysalis Devnet'
export const CHRYSALIS_DEVNET_BECH32_HRP = 'atoi'

export const getClientOptions = (): ClientOptions => {
    const { id, type } =
        get(activeProfile)?.settings?.networkConfig.network || getOfficialNetwork(NetworkType.ChrysalisMainnet)

    const node = getOfficialNodes(type)[0]
    node.isPrimary = true

    return {
        node,
        nodes: getOfficialNodes(type).map((n) => ({ ...n, isPrimary: n.url === node.url })),
        network: id,
        automaticNodeSelection: true,
        includeOfficialNodes: true,
        localPow: true,
    }
}

/**
 * Given the type of IOTA network, construct the default official network
 * configuration object. This is useful for initializing new or resetting old
 * network configurations.
 *
 * @method getOfficialNetworkConfig
 *
 * @param {NetworkType} type
 *
 * @returns {NetworkConfig}
 */
export const getOfficialNetworkConfig = (type: NetworkType): NetworkConfig => ({
    network: getOfficialNetwork(type),
    nodes: getOfficialNodes(type),
    automaticNodeSelection: true,
    includeOfficialNodes: true,
    localPow: true,
})

/**
 * Constructs an official IOTA network object given the type of network
 * required.
 *
 * @method getOfficialNetwork
 *
 * @param {NetworkType} type
 *
 * @returns {Network}
 */
export const getOfficialNetwork = (type: NetworkType): Network => {
    switch (type) {
        case NetworkType.ChrysalisDevnet:
            return {
                id: CHRYSALIS_DEVNET_ID,
                name: CHRYSALIS_DEVNET_NAME,
                type,
                bech32Hrp: CHRYSALIS_DEVNET_BECH32_HRP,
            }
        case NetworkType.ChrysalisMainnet:
        default:
            return {
                id: CHRYSALIS_MAINNET_ID,
                name: CHRYSALIS_MAINNET_NAME,
                type: type || NetworkType.ChrysalisMainnet,
                bech32Hrp: CHRYSALIS_MAINNET_BECH32_HRP,
            }
    }
}

/**
 * Constructs a list of the official IOTA nodes for a given network.
 *
 * @method getOfficialNodes
 *
 * @param {NetworkType} type
 *
 * @returns {Node[]}
 */
export const getOfficialNodes = (type: NetworkType): Node[] =>
    getOfficialNodeUrls(type).map((url) => getOfficialNode(type, url))

const getOfficialNodeUrls = (networkType: NetworkType): string[] => {
    switch (networkType) {
        case NetworkType.ChrysalisDevnet:
            return ['https://api.lb-0.h.chrysalis-devnet.iota.cafe', 'https://api.lb-1.h.chrysalis-devnet.iota.cafe']
        case NetworkType.ChrysalisMainnet:
            return ['https://chrysalis-nodes.iota.org', 'https://chrysalis-nodes.iota.cafe']
        default:
            return []
    }
}

const getOfficialNode = (type: NetworkType, url: string): Node => ({
    url,
    auth: { username: '', password: '' },
    network: getOfficialNetwork(type),
    isPrimary: false,
    isDisabled: false,
})

/**
 * Determines whether the type of a given network is "official", meaning
 * the IOTA Foundation hosts nodes publicly for that network.
 *
 * @method isOfficialNetwork
 *
 * @param {NetworkType} type
 *
 * @returns {boolean}
 */
export const isOfficialNetwork = (type: NetworkType): boolean => {
    switch (type) {
        case NetworkType.ChrysalisMainnet:
        case NetworkType.ChrysalisDevnet:
            return true
        default:
            return false
    }
}

/**
 * Find a network by its associated ID.
 *
 * @method getNetworkById
 *
 * @param {string} id
 *
 * @returns {Network}
 */
export const getNetworkById = (id: string): Network => {
    const type = getNetworkType(id)
    switch (type) {
        case NetworkType.ChrysalisMainnet:
            return {
                id,
                type,
                name: CHRYSALIS_MAINNET_NAME,
                bech32Hrp: CHRYSALIS_MAINNET_BECH32_HRP,
            }
        case NetworkType.ChrysalisDevnet:
            return {
                id,
                type,
                name: CHRYSALIS_DEVNET_NAME,
                bech32Hrp: CHRYSALIS_DEVNET_BECH32_HRP,
            }
        case NetworkType.PrivateNet:
            return <Network>{ id, type }
        default:
            return <Network>{}
    }
}

const getNetworkType = (id: string): NetworkType => {
    switch (id) {
        case CHRYSALIS_MAINNET_ID:
            return NetworkType.ChrysalisMainnet
        case CHRYSALIS_DEVNET_ID:
            return NetworkType.ChrysalisDevnet
        default:
            if (id) return NetworkType.PrivateNet
            else return undefined
    }
}

/**
 * Strips a node of its authentication data accordingly as some nodes return errors
 * whenever an undefined or empty field is provided.
 *
 * @method cleanNodeAuthOfNode
 *
 * @param {Node} node
 *
 * @returns {Node}
 */
export const cleanNodeAuthOfNode = (node: Node): Node => ({ ...node, auth: cleanNodeAuth(node?.auth) })

/**
 * Strips node authentication of unnecessary data, sometimes important for having
 * successful API requests to a node.
 *
 * @method cleanNodeAuth
 *
 * @param {NodeAuth} auth
 *
 * @returns {NodeAuth}
 */
export const cleanNodeAuth = (auth: NodeAuth): NodeAuth =>
    auth?.jwt ? auth : { username: auth?.username || '', password: auth?.password || '' }

/**
 * Determines whether node authentication data is valid.
 *
 * @method isNodeAuthValid
 *
 * @param {NodeAuth} auth
 *
 * @returns {boolean}
 */
export const isNodeAuthValid = (auth: NodeAuth): boolean => {
    if (auth?.jwt) return true
    else if (auth?.username && auth?.password) return true

    return false
}

/**
 * Check if a node's URL is valid.
 *
 * @method checkNodeUrlValidity
 *
 * @param {Node[]} nodesList list of current nodes
 * @param {string} newUrl new URL candidate
 * @param {boolean} allowInsecure allows for connecting via plain HTTP
 *
 * @returns {string | undefined}
 */
export const checkNodeUrlValidity = (nodesList: Node[], newUrl: string, allowInsecure: boolean): string | undefined => {
    // Check if URL is valid
    if (!isValidUrl(newUrl)) {
        return 'error.node.invalid'
    }

    // Only allow HTTPS nodes
    if (!allowInsecure && !isValidHttpsUrl(newUrl)) {
        return 'error.node.https'
    }

    const hasDefaultHttpsPort = newUrl.endsWith(':443')
    if (hasDefaultHttpsPort) {
        newUrl = newUrl.slice(0, -4)
    }

    // Check whether the node was already added to the list
    /* eslint-disable @typescript-eslint/prefer-regexp-exec */
    if (nodesList && nodesList.some(({ url }) => (url.endsWith(':443') ? url.slice(0, -4) : url).match(newUrl))) {
        return 'error.node.duplicate'
    }

    return undefined
}

/**
 * Update the client options for a profile.
 *
 * @method updateClientOptions
 *
 * @param {NetworkConfig} config
 *
 * @returns {void}
 */
export const updateClientOptions = (config: NetworkConfig): void => {
    const nodeCandidates = getNodeCandidates(config).map((n) => ({ ...n, network: config.network }))
    const clientOptions: ClientOptions = {
        ...config,
        node: nodeCandidates.find((n) => n.isPrimary),
        nodes: nodeCandidates,
        network: config.network.id,
    }
    if (!clientOptions.node) {
        console.error('Error: The client options does not have a primary node.')
        return
    }

    const hasMismatchedNetwork = clientOptions.node?.network?.id !== clientOptions.network
    if (hasMismatchedNetwork && isNewNotification('warning')) {
        showAppNotification({
            type: 'error',
            message: localize('error.network.badNodes'),
        })

        return
    }

    api.setClientOptions(clientOptions, {
        onSuccess() {
            const { accounts } = get(wallet)
            accounts.set(get(accounts).map((a) => ({ ...a, clientOptions })))
        },
        onError(err) {
            console.error(err)
        },
    })
}

/**
 * Determine the appropriate node candidates from a given network configuration.
 *
 * @method getNodeCandiates
 *
 * @param {NetworkConfig} config
 *
 * @returns {Node[]}
 */
export const getNodeCandidates = (config: NetworkConfig): Node[] => {
    if (!config) return []

    const useAutomaticSelection = config.nodes.length === 0 || config.automaticNodeSelection

    let nodeCandidates
    if (useAutomaticSelection) {
        nodeCandidates = getOfficialNodes(config.network.type).map((n, idx) => ({ ...n, isPrimary: idx === 0 }))
    } else {
        nodeCandidates = config.includeOfficialNodes
            ? addOfficialNodes(config.network.type, config.nodes)
            : config.nodes.filter(
                  (n) =>
                      !getOfficialNodes(config.network.type)
                          .map((_n) => _n.url)
                          .includes(n.url)
              )
    }

    return ensureSinglePrimaryNode(nodeCandidates)
}

const addOfficialNodes = (networkType: NetworkType, nodes: Node[]): Node[] => {
    const officialNodes = getOfficialNodes(networkType)
    const nonOfficialNodes = nodes.filter((n) => !officialNodes.map((_n) => _n.url).includes(n.url))

    return [...officialNodes, ...nonOfficialNodes]
}

/**
 * Ensures that a list of nodes contains only one primary node. If none exist, one will
 * be selected randomly.
 *
 * @method ensureSinglePrimaryNode
 *
 * @param {Node[]} nodes
 *
 * @returns {Node[]}
 */
export const ensureSinglePrimaryNode = (nodes: Node[]): Node[] => {
    if (!nodes || !nodes.length) return nodes

    const numPrimaryNodes = nodes.filter((n) => n.isPrimary).length
    if (numPrimaryNodes === 0) {
        const randIdx = Math.floor(Math.random() * nodes.length)
        return nodes.map((n, idx) => ({ ...n, isPrimary: idx === randIdx }))
    } else if (numPrimaryNodes === 1) {
        return nodes
    } else if (numPrimaryNodes > 1) {
        const activeNode = nodes.find((n) => n.isPrimary)
        return nodes.map((n, idx) => ({ ...n, isPrimary: n.url === activeNode.url }))
    }
}
