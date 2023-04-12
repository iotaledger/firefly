import { NetworkId } from '../enums'

/**
 * Formats a protocol name to be displayed in localized text (e.g. 'iota' -> 'IOTA').
 *
 * @method formatProtocolName
 * @param {NetworkProtocol} protocol list of current nodes
 * @returns {string}
 */
export function formatProtocolName(networkId: NetworkId): string {
    switch (networkId) {
        case NetworkId.Iota:
            return 'IOTA'
        case NetworkId.Shimmer:
            return 'Shimmer'
    }
}
