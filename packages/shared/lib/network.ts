import type { Node } from './typings/node'
import { isValidHttpsUrl, isValidUrl } from './utils'
import { Network, NetworkConfig, NetworkType } from './typings/network'
import { api, wallet } from './wallet'
import type { ClientOptions } from './typings/client'
import { get } from 'svelte/store'
import type { WalletAccount } from './typings/wallet'
import { updateProfile } from './profile'

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
            return ['https://api.lb-0.h.testnet.chrysalis2.com', 'https://api.lb-1.h.testnet.chrysalis2.com']
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

// 0. Validate input as necessary and only proceed if valid
// 1. Init independent variables (i.e. automaticNodeSelection, includeOfficialNodes)
// 2. Construct dependent variables as needed
// 3. Set API client options then update profile data if successful
export const updateAccountNetworkConfig = (config: NetworkConfig): void => {
    // updateProfile('settings.networkConfig.automaticNodeSelection', automaticNodeSelection)
    // updateProfile('settings.networkConfig.includeOfficialNodes', includeOfficialNodes)
    // updateProfile('settings.networkConfig.network', network)
    //
    // const actualNetworkId = automaticNodeSelection
    //     ? getOfficialDefaultNetwork()
    //     : networkId === 'custom'
    //         ? customNetworkId
    //         : networkId
    //
    // let clientNodes = []
    // let officialNodes = getOfficialNodes(actualNetworkId)
    // const officialNetworks = getOfficialNetworks()
    // const officialNetworkIds = officialNetworks.map((n) => n.network)
    // const allNetworks = officialNetworkIds.slice()
    // const primaryNode = nodes.find((n) => n.networkId === actualNetworkId && n.isPrimary)
    //
    // // Get the list of non official nodes
    // const nonOfficialNodes = nodes.filter((n) => !officialNetworkIds.includes(n.networkId))
    //
    // // If we are in automatic node selection make sure none of the offical nodes
    // // are disabled
    // if (automaticNodeSelection) {
    //     officialNodes = officialNodes.map((o) => ({ ...o, disabled: false }))
    // }
    //
    // // If we are in automatic mode, or including the official nodes in manual mode
    // // or in manual mode and there are no non official nodes for this network
    // if (
    //     automaticNodeSelection ||
    //     includeOfficialNodes ||
    //     nonOfficialNodes.filter((n) => n.networkId === actualNetworkId).length === 0
    // ) {
    //     clientNodes = [...officialNodes]
    // }
    //
    // // Now add back the non official nodes, if we are in automatic mode we should
    // // disable them, otherwise retain their current disabled state
    // if (nonOfficialNodes.length > 0) {
    //     clientNodes = [
    //         ...clientNodes,
    //         ...nonOfficialNodes.map((o) => ({
    //             ...o,
    //             disabled: automaticNodeSelection ? true : o.isDisabled,
    //         })),
    //     ]
    // }
    //
    // // Disable all nodes which don't match the current network id
    // for (const clientNode of clientNodes) {
    //     if (clientNode.networkId !== actualNetworkId) {
    //         clientNode.disabled = true
    //     }
    //     if (!allNetworks.includes(clientNode.networkId)) {
    //         allNetworks.push(clientNode.networkId)
    //     }
    //     if (clientNode.url === primaryNode?.url) {
    //         clientNode.isPrimary = true
    //     }
    // }
    //
    // // Get all the enabled nodes and make sure the primary url is enabled
    // const networkNodes = clientNodes.filter((n) => n.networkId === actualNetworkId)
    //
    // // Get the primary node
    // let clientNode = networkNodes.find((n) => n.isPrimary)
    //
    // // If not selected then auto select the first enabled node
    // if (!clientNode) {
    //     const allEnabled = networkNodes.filter((n) => !n.disabled)
    //     if (allEnabled.length > 0) {
    //         clientNode = allEnabled[0]
    //     }
    // }
    //
    // const clientOptions = {
    //     network,
    //     nodes: clientNodes,
    //     node: clientNode,
    //     localPow,
    // }
    //

    // const clientNodes = config.networks.find((n) => n.isActive).nodes
    //
    // const clientOptions: ClientOptions = {
    //     network: {},
    //     node: '',
    //     nodes: [],
    //     localPow: true,
    // }
    // api.setClientOptions(clientOptions, {
    //     onSuccess() {
    //         const { accounts } = get(wallet)
    //
    //         accounts.update((_accounts) =>
    //             _accounts.map((_account) =>
    //                 Object.assign<WalletAccount, WalletAccount, Partial<WalletAccount>>({} as WalletAccount, _account, {
    //                     clientOptions,
    //                 })
    //             )
    //         )
    //     },
    //     onError(err) {
    //         console.error(err)
    //     },
    // })
    for (const k in config) {
        updateProfile(`settings.networkConfig.${k}`, config[k])
    }

    const clientOptions: ClientOptions = {
        node: config.nodes.find((n) => n.isPrimary),
        nodes: config.nodes,
        networkId: config.network.id,
        localPow: config.localPow,
    }
    api.setClientOptions(clientOptions, {
        onSuccess() {
            const { accounts } = get(wallet)
            accounts.update((_accounts) =>
                _accounts.map((_account) =>
                    Object.assign<WalletAccount, WalletAccount, Partial<WalletAccount>>({} as WalletAccount, _account, {
                        clientOptions,
                    })
                )
            )
        },
        onError(err) {
            console.error(err)
        },
    })
}
