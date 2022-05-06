import { Node, NodeAuth } from './typings/node'
import { isValidHttpsUrl, isValidUrl } from './utils'
import { Network, NetworkConfig, NetworkId, NetworkProtocol } from './typings/network'
import { NetworkType } from './typings/network'
import { api, wallet } from './wallet'
import { isNewNotification, showAppNotification } from './notifications'
import { localize } from '@core/i18n'
import { ClientOptions } from './typings/client'
import { get } from 'svelte/store'
import { activeProfile } from './profile'
import { BASE_TOKEN } from './typings/assets'

const NETWORK: Readonly<{ [key in NetworkProtocol]?: { [key in NetworkType]?: Network } }> = {
    [NetworkProtocol.IOTA]: {
        [NetworkType.Mainnet]: {
            id: 'chrysalis-mainnet',
            name: 'Chrysalis Mainnet',
            protocol: NetworkProtocol.IOTA,
            type: NetworkType.Mainnet,
            bech32Hrp: 'iota',
            baseToken: BASE_TOKEN[NetworkProtocol.IOTA],
        },
        [NetworkType.Devnet]: {
            id: 'chrysalis-devnet',
            name: 'Chrysalis Devnet',
            protocol: NetworkProtocol.IOTA,
            type: NetworkType.Devnet,
            bech32Hrp: 'atoi',
            baseToken: BASE_TOKEN[NetworkProtocol.IOTA],
        },
        [NetworkType.PrivateNet]: <Network>{
            name: 'Private Net',
            protocol: NetworkProtocol.IOTA,
            type: NetworkType.Devnet,
        },
    },
    [NetworkProtocol.Shimmer]: {
        [NetworkType.Mainnet]: {
            id: 'shimmer-mainnet',
            name: 'Shimmer Mainnet',
            protocol: NetworkProtocol.Shimmer,
            type: NetworkType.Mainnet,
            bech32Hrp: 'smr',
            baseToken: BASE_TOKEN[NetworkProtocol.Shimmer],
        },
        [NetworkType.Devnet]: {
            id: 'shimmer-devnet',
            name: 'Shimmer Devnet',
            protocol: NetworkProtocol.Shimmer,
            type: NetworkType.Devnet,
            bech32Hrp: 'rms',
            baseToken: BASE_TOKEN[NetworkProtocol.Shimmer],
        },
        [NetworkType.PrivateNet]: <Network>{
            name: 'Private Net',
            protocol: NetworkProtocol.Shimmer,
            type: NetworkType.PrivateNet,
        },
    },
}

const EXPLORER: Readonly<{ [key in NetworkProtocol]?: { [key in NetworkType]?: string } }> = {
    [NetworkProtocol.IOTA]: {
        [NetworkType.Mainnet]: 'https://explorer.iota.org/mainnet',
        [NetworkType.Devnet]: 'https://explorer.iota.org/devnet',
    },
    [NetworkProtocol.Shimmer]: {
        [NetworkType.Mainnet]: 'https://explorer.shimmer.org/mainnet',
        [NetworkType.Devnet]: 'https://explorer.shimmer.org/devnet',
    },
}

const OFFICIAL_NODE_URLS: Readonly<{ [key in NetworkProtocol]?: { [key in NetworkType]?: string[] } }> = {
    [NetworkProtocol.IOTA]: {
        [NetworkType.Mainnet]: [
            'https://chrysalis-nodes.iota.org',
            'https://chrysalis-nodes.iota.cafe',
            'https://mainnet-node.tanglebay.com',
        ],
        [NetworkType.Devnet]: [
            'https://api.lb-0.h.chrysalis-devnet.iota.cafe',
            'https://api.lb-1.h.chrysalis-devnet.iota.cafe',
        ],
    },
    [NetworkProtocol.Shimmer]: {
        [NetworkType.Mainnet]: ['https://api.alphanet.iotaledger.net'],
        [NetworkType.Devnet]: ['https://api.alphanet.iotaledger.net'],
    },
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
export const getOfficialNetworkConfig = (protocol: NetworkProtocol, type: NetworkType): NetworkConfig => ({
    network: getOfficialNetwork(protocol, type),
    nodes: setRandomPrimaryNode(getOfficialNodes(protocol, type)),
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
export const getOfficialNetwork = (protocol: NetworkProtocol, type: NetworkType): Network =>
    NETWORK[protocol][type] ?? <Network>{}

/**
 * Constructs a list of the official IOTA nodes for a given network.
 *
 * @method getOfficialNodes
 *
 * @param {NetworkType} type
 *
 * @returns {Node[]}
 */
export const getOfficialNodes = (protocol: NetworkProtocol, type: NetworkType): Node[] =>
    getOfficialNodeUrls(protocol, type).map((url) => getOfficialNode(protocol, type, url))

const getOfficialNodeUrls = (protocol: NetworkProtocol, type: NetworkType): string[] =>
    OFFICIAL_NODE_URLS[protocol][type] ?? []

const getOfficialNode = (protocol, type: NetworkType, url: string): Node => ({
    url,
    auth: { username: '', password: '' },
    network: getOfficialNetwork(protocol, type),
    isPrimary: false,
    isDisabled: false,
})

export const getOfficialExplorer = (protocol: NetworkProtocol, id: NetworkId): string =>
    EXPLORER[getNetworkType(protocol, id)] ?? ''

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
export const isOfficialNetwork = (type: NetworkType): boolean =>
    type !== NetworkType.PrivateNet && Object.values(NetworkType).some((networkType) => networkType === type)

/**
 * Find a network by its associated ID.
 *
 * @method getNetworkById
 *
 * @param {string} id
 *
 * @returns {Network}
 */
export const getNetworkById = (protocol: NetworkProtocol, id: NetworkId): Network => {
    if (id) {
        const networkType = getNetworkType(protocol, id)
        return networkType === NetworkType.PrivateNet
            ? { id, ...NETWORK[protocol][NetworkType.PrivateNet] }
            : NETWORK[protocol][networkType]
    }
    return <Network>{}
}

const getNetworkType = (protocol: NetworkProtocol, id: NetworkId): NetworkType => {
    if (id) {
        return Object.values(NETWORK[protocol]).find((network) => network.id === id)?.type ?? NetworkType.PrivateNet
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
    if (!isValidUrl(newUrl)) {
        return 'error.node.invalid'
    }

    /**
     * CAUTION: We are going to wait for HTTP support to
     * be audited. Until then this assignment statement
     * must stay.
     */
    allowInsecure = false
    if (!allowInsecure && !isValidHttpsUrl(newUrl)) {
        return 'error.node.https'
    }

    const hasDefaultHttpsPort = newUrl.endsWith(':443')
    if (hasDefaultHttpsPort) {
        newUrl = newUrl.slice(0, -4)
    }

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
    const clientOptions = buildClientOptions(config)
    if (!clientOptions.node) return

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

export const buildClientOptions = (config: NetworkConfig): ClientOptions => {
    const nodeCandidates = getNodeCandidates(config).map((n) => ({ ...n, network: config.network }))
    return {
        ...config,
        node: nodeCandidates.find((n) => n.isPrimary),
        nodes: nodeCandidates,
        network: config.network.id,
    }
}

export const getDefaultClientOptions = (protocol: NetworkProtocol): ClientOptions => {
    const { id, type } =
        get(activeProfile)?.settings?.networkConfig.network || getOfficialNetwork(protocol, NetworkType.Mainnet)

    const node = getOfficialNodes(protocol, type)[0]
    node.isPrimary = true

    return {
        node,
        nodes: getOfficialNodes(protocol, type).map((n) => ({ ...n, isPrimary: n.url === node.url })),
        network: id,
        automaticNodeSelection: true,
        includeOfficialNodes: true,
        localPow: true,
    }
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
    const officialNodes = getOfficialNodes(config.network.protocol, config.network.type).map((n, idx) => ({
        ...n,
        isPrimary: false,
    }))

    let nodeCandidates
    if (useAutomaticSelection) {
        nodeCandidates = officialNodes
    } else {
        nodeCandidates = config.includeOfficialNodes
            ? addOfficialNodes(config.network.protocol, config.network.type, config.nodes)
            : config.nodes.filter((n) => officialNodes.find((_n) => _n.url === n.url) === undefined)
    }

    return ensureSinglePrimaryNode(nodeCandidates)
}

const addOfficialNodes = (networkProtocol: NetworkProtocol, networkType: NetworkType, nodes: Node[]): Node[] => {
    let officialNodes = getOfficialNodes(networkProtocol, networkType)

    // If an official node is currently set as primary then keep it as primary
    officialNodes = officialNodes.map((n) =>
        Object.assign(
            n,
            nodes.find((p) => p.isPrimary && n.url === p.url)
        )
    )

    const nonOfficialNodes = nodes.filter((n) => officialNodes.find((_n) => _n.url === n.url) === undefined)

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
        return setRandomPrimaryNode(nodes)
    } else if (numPrimaryNodes === 1) {
        return nodes
    } else if (numPrimaryNodes > 1) {
        const activeNode = nodes.find((n) => n.isPrimary)
        return nodes.map((n, idx) => ({ ...n, isPrimary: n.url === activeNode.url }))
    }
}

const setRandomPrimaryNode = (nodes: Node[]): Node[] => {
    const randIdx = Math.floor(Math.random() * nodes.length)
    return nodes.map((n, idx) => ({ ...n, isPrimary: idx === randIdx }))
}
