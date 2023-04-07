import { NETWORK_INFO_MAP } from '../constants'
import { NetworkProtocol, NetworkType } from '../enums'
import { INetworkInfo } from '../interfaces'

/**
 * Constructs an official IOTA network object given the type of network
 * required.
 * @method getOfficialNetwork
 * @param {NetworkProtocol} protocol
 * @param {NetworkType} type
 *
 * @returns {Network}
 */
export function getOfficialNetworkInfo(protocol: NetworkProtocol, type: NetworkType): INetworkInfo {
    return NETWORK_INFO_MAP?.[protocol]?.[type] ?? <INetworkInfo>{}
}
