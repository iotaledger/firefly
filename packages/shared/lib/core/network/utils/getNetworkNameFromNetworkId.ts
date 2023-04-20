import { NetworkId } from '../enums'

/**
 * Formats a protocol name to be displayed in localized text (e.g. 'iota' -> 'IOTA').
 *
 * @method getNetworkNameFromNetworkId
 * @param {NetworkProtocol} protocol list of current nodes
 * @returns {string}
 */
export function getNetworkNameFromNetworkId(networkId: NetworkId): string {
    switch (networkId) {
        case NetworkId.Iota:
            return 'IOTA'
        case NetworkId.Shimmer:
            return 'Shimmer'
        case NetworkId.Testnet:
            return 'Testnet'
    }
}
