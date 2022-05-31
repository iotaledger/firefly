import { IClientOptions, INode } from '../interfaces'
import { NetworkProtocol, NetworkType } from '../enums'
import { ensureSinglePrimaryNode } from './ensureSinglePrimaryNode'
import { getOfficialNodes } from './getOfficialNodes'
import { activeProfile } from '@core/profile'
import { get } from 'svelte/store'

/**
 * Determine the appropriate node candidates from a given network configuration.
 * @method getNodeCandidates
 * @param {INetworkConfig} config
 * @returns {INode[]}
 */
export function getNodeCandidates(config: IClientOptions): INode[] {
    if (!config) return []

    const { networkProtocol, networkType } = get(activeProfile)

    const useAutomaticSelection = config.nodes.length === 0 || config.automaticNodeSelection
    const officialNodes = getOfficialNodes(networkProtocol, networkType).map((n) => ({
        ...n,
        isPrimary: false,
    }))

    let nodeCandidates
    if (useAutomaticSelection) {
        nodeCandidates = officialNodes
    } else {
        nodeCandidates = config.includeOfficialNodes
            ? addOfficialNodes(networkProtocol, networkType, config.nodes)
            : config.nodes.filter((n) => officialNodes.find((_n) => _n.url === n.url) === undefined)
    }

    return ensureSinglePrimaryNode(nodeCandidates)
}

function addOfficialNodes(networkProtocol: NetworkProtocol, networkType: NetworkType, nodes: INode[]): INode[] {
    let officialNodes = getOfficialNodes(networkProtocol, networkType)

    // If an official node is currently set as primary then keep it as primary
    officialNodes = officialNodes.map((n) =>
        Object.assign(
            n,
            nodes.find((p) => n.url === p.url)
        )
    )

    const nonOfficialNodes = nodes.filter((n) => officialNodes.find((_n) => _n.url === n.url) === undefined)

    return [...officialNodes, ...nonOfficialNodes]
}
