import { NETWORK } from '../constants'
import { NetworkProtocol, NetworkType } from '../enums'
import { INetwork } from '../interfaces'

/**
 * Constructs an official IOTA network object given the type of network
 * required.
 * @method getOfficialNetwork
 * @param {NetworkProtocol} protocol
 * @param {NetworkType} type
 *
 * @returns {Network}
 */
export function getOfficialNetwork(protocol: NetworkProtocol, type: NetworkType): INetwork {
    return NETWORK?.[protocol]?.[type] ?? <INetwork>{}
}
