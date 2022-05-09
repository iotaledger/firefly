import { NetworkType } from '../enums'

/**
 * Determines whether the type of a given network is 'official', meaning
 * the IOTA Foundation hosts nodes publicly for that network.
 * @method isOfficialNetwork
 * @param {NetworkType} type
 * @returns {boolean}
 */
export function isOfficialNetwork(type: NetworkType): boolean {
    return type !== NetworkType.PrivateNet && Object.values(NetworkType).some((networkType) => networkType === type)
}
