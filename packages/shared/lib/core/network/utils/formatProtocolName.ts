import { NetworkProtocol } from '../enums'

/**
 * Formats a protocol name to be displayed in localized text (e.g. 'iota' -> 'IOTA').
 *
 * @method formatProtocolName
 * @param {NetworkProtocol} protocol list of current nodes
 * @returns {string}
 */
export function formatProtocolName(protocol: NetworkProtocol): string {
    switch (protocol) {
        case NetworkProtocol.IOTA:
            return 'IOTA'
        case NetworkProtocol.Shimmer:
            return 'Shimmer'
    }
}
