import { NetworkId } from '../enums'

/**
 * Determines whether the network id is 'official', meaning
 * the IOTA Foundation hosts nodes publicly for that network.
 * @method isOfficialNetwork
 * @param {NetworkId} networkId
 * @returns {boolean}
 */
export function isOfficialNetwork(networkId: NetworkId): boolean {
    return networkId !== NetworkId.Custom && Object.values(NetworkId).some((_networkId) => _networkId === networkId)
}
