import { NetworkProtocol, NetworkType } from '../enums'
import { INode } from '../interfaces'
import { OFFICIAL_NODE_URLS } from '../constants'

/**
 * Constructs a list of the official IOTA nodes for a given network.
 */
export function getOfficialNodes(protocol: NetworkProtocol, type: NetworkType): INode[] {
    return getOfficialNodeUrls(protocol, type).map((url) => buildOfficialNode(url))
}

function getOfficialNodeUrls(protocol: NetworkProtocol, type: NetworkType): string[] {
    return OFFICIAL_NODE_URLS?.[protocol]?.[type] ?? []
}

function buildOfficialNode(url: string): INode {
    return {
        url,
        auth: { username: '', password: '' },
        disabled: false,
    }
}
