import { NetworkProtocol, NetworkType } from '../enums'
import { INode } from '../interfaces'
import { OFFICIAL_NODE_URLS } from '../constants'
import { getOfficialNetwork } from './getOfficialNetwork'

/**
 * Constructs a list of the official IOTA nodes for a given network.
 * @method getOfficialNodes
 * @param {NetworkType} type
 * @returns {Node[]}
 */
export function getOfficialNodes(protocol: NetworkProtocol, type: NetworkType): INode[] {
    return getOfficialNodeUrls(protocol, type).map((url) => getOfficialNode(protocol, type, url))
}

function getOfficialNodeUrls(protocol: NetworkProtocol, type: NetworkType): string[] {
    return OFFICIAL_NODE_URLS?.[protocol]?.[type] ?? []
}

function getOfficialNode(protocol: NetworkProtocol, type: NetworkType, url: string): INode {
    return {
        url,
        auth: { username: '', password: '' },
        network: getOfficialNetwork(protocol, type),
        isPrimary: false,
        isDisabled: false,
    }
}
