import { NetworkId } from '../enums'

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
