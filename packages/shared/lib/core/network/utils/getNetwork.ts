import { NETWORK } from '../constants'
import { NetworkProtocol, NetworkType } from '../enums'
import { INetwork } from '../interfaces'

/**
 * Find a network by its associated ID.
 * @method getNetwork
 * @param {NetworkProtocol} protocol
 * @param {NetworkType} type
 * @param {string} [id]
 * @returns {INetwork}
 */
export function getNetwork(protocol: NetworkProtocol, type: NetworkType, id?: string): INetwork {
    const _network = NETWORK?.[protocol]?.[type] ?? {
        ...(id ? { id } : { id: 'undefined' }),
        name: 'undefined',
        protocol,
        type,
    }

    return type === NetworkType.PrivateNet ? { id, ..._network } : _network
}
