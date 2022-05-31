import { NetworkProtocol, NetworkType } from '../enums'
import { setRandomPrimaryNode } from './setRandomPrimaryNode'
import { getOfficialNetwork } from './getOfficialNetwork'
import { getOfficialNodes } from './getOfficialNodes'

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

export function getOfficialNetworkConfig(protocol: NetworkProtocol, type: NetworkType): unknown {
    return {
        network: getOfficialNetwork(protocol, type),
        nodes: setRandomPrimaryNode(getOfficialNodes(protocol, type)),
        automaticNodeSelection: true,
        includeOfficialNodes: true,
        localPow: true,
    }
}
