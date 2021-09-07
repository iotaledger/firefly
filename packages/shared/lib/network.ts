import type { Node } from './typings/node'
import { isValidHttpsUrl, isValidUrl } from './utils'
import { Network, NetworkConfig, NetworkType } from './typings/network'
import { api, wallet } from './wallet'
import type { ClientOptions } from './typings/client'
import { get } from 'svelte/store'
import { isNewNotification, showAppNotification } from './notifications'
import { localize } from './i18n'
import { client } from './typings'

export const getOfficialNetwork = (type: NetworkType = NetworkType.ChrysalisMainnet): Network => {
    switch (type) {
        case NetworkType.ChrysalisDevnet:
            return {
                id: 'chrysalis-devnet',
                name: 'Chrysalis Devnet',
                type,
            }
        case NetworkType.ChrysalisMainnet:
        default:
            return {
                id: 'chrysalis-mainnet',
                name: 'Chrysalis Mainnet',
                type,
            }
    }
}

export const getNetworkById = (id: string): Network => {
    const type = getNetworkType(id)
    switch (type) {
        case NetworkType.ChrysalisMainnet:
            return {
                id,
                type,
                name: 'Chrysalis Mainnet',
            }
        case NetworkType.ChrysalisDevnet:
            return {
                id,
                type,
                name: 'Chrysalis Devnet',
            }
        default:
            return {
                id,
                type: NetworkType.PrivateNet,
                name: 'Private Net',
            }
    }
}

const getNetworkType = (id: string): NetworkType => {
    switch (id) {
        case 'chrysalis-mainnet':
            return NetworkType.ChrysalisMainnet
        case 'chrysalis-devnet':
            return NetworkType.ChrysalisDevnet
        default:
            return NetworkType.PrivateNet
    }
}

export const getDefaultNetworkConfig = (): NetworkConfig => ({
    network: getOfficialNetwork(NetworkType.ChrysalisMainnet),
    nodes: getOfficialNodes(NetworkType.ChrysalisMainnet),
    automaticNodeSelection: false,
    includeOfficialNodes: true,
    localPow: true,
})

export const getOfficialNodes = (
    networkType: NetworkType = NetworkType.ChrysalisMainnet,
    activate: boolean = false
): Node[] =>
    getOfficialNodeUrls(networkType).map((url: string) => ({
        url,
        auth: { username: '', password: '' },
        network: getOfficialNetwork(networkType),
        isPrimary: activate && url === getOfficialNodeUrls(networkType)[0],
        isDisabled: false,
    }))

const getOfficialNodeUrls = (networkType: NetworkType = NetworkType.ChrysalisMainnet): string[] => {
    switch (networkType) {
        case NetworkType.ChrysalisDevnet:
            return ['https://api.lb-0.h.chrysalis-devnet.iota.cafe', 'https://api.lb-1.h.chrysalis-devnet.iota.cafe']
        case NetworkType.ChrysalisMainnet:
        default:
            return ['https://chrysalis-nodes.iota.org', 'https://chrysalis-nodes.iota.cafe']
    }
}

/**
 * Check if a node url is valid
 * @param {Node[]} nodesList: list of current nodes
 * @param {string} newUrl: new node url candidate
 * @param {boolean} allowInSecure: allow the use of plain http
 * @returns {string | undefined}
 */
export const isNodeUrlValid = (nodesList: Node[], newUrl: string, allowInSecure: boolean): string | undefined => {
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
    /* eslint-disable @typescript-eslint/prefer-regexp-exec */
    if (nodesList && nodesList.some(({ url }) => (url.endsWith(':443') ? url.slice(0, -4) : url).match(newUrl))) {
        return 'error.node.duplicate'
    }

    return undefined
}

export const updateClientOptions = (config: NetworkConfig): void => {
    const nodeCandidates =
        config.nodes.length === 0 || config.automaticNodeSelection
            ? getOfficialNodes(config.network.type, true)
            : config.nodes.filter((n) => !n.isDisabled)

    const clientOptions: ClientOptions = {
        node: nodeCandidates.find((n) => n.isPrimary),
        nodes: nodeCandidates,
        network: config.network.id,
        localPow: config.localPow,
    }

    const hasMismatchedNetwork = clientOptions.node.network.id !== clientOptions.network
    if (hasMismatchedNetwork && isNewNotification('warning')) {
        showAppNotification({
            type: 'warning',
            message: localize('error.network.badNodes'),
        })

        return
    }

    api.setClientOptions(clientOptions, {
        onSuccess() {
            get(wallet).accounts.update((_accounts) => _accounts.map((a) => ({ ...a, clientOptions })))
        },
        onError(err) {
            console.error(err)
        },
    })
}

export const isOfficialNetwork = (type: NetworkType): boolean => {
    switch (type) {
        case NetworkType.ChrysalisMainnet:
        case NetworkType.ChrysalisDevnet:
            return true
        default:
            return false
    }
}

export const cleanNodeAuth = (node: Node): Node => ({
    ...node,
    auth: node.auth.jwt ? node.auth : { username: node.auth.username || '', password: node.auth.password || '' },
})
