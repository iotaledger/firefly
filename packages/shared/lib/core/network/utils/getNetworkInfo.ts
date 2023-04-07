import { NETWORK_INFO_MAP } from '../constants'
import { NetworkProtocol, NetworkType } from '../enums'
import { INetworkInfo } from '../interfaces'

/**
 * Find a network by its associated ID.
 * @method getNetwork
 * @param {NetworkProtocol} protocol
 * @param {NetworkType} type
 * @param {string} [id]
 * @returns {INetworkInfo}
 */
export function getNetworkInfo(protocol: NetworkProtocol, type: NetworkType, id?: string): INetworkInfo {
    const _network = NETWORK_INFO_MAP?.[protocol]?.[type] ?? {
        ...(id ? { id } : { id: 'undefined' }),
        name: 'undefined',
        protocol,
        type,
    }

    return type === NetworkType.PrivateNet ? { id, ..._network } : _network
}
