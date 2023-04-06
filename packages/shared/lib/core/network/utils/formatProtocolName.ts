import { NetworkId } from '../enums'

/**
 * Formats a protocol name to be displayed in localized text (e.g. 'iota' -> 'IOTA').
 *
 * @method formatProtocolName
 * @param {NetworkId} networkId
 * @returns {string}
 */
export function formatProtocolName(networkId: NetworkId): string {
    switch (networkId) {
        case NetworkId.Iota:
            return 'IOTA'
        case NetworkId.Shimmer:
            return 'Shimmer'
        case NetworkId.Testnet:
            return 'Testnet'
        default:
            return 'Custom'
    }
}
