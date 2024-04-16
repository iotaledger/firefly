import { NetworkId } from '../enums'

export function getNetworkNameFromNetworkId(networkId: NetworkId): string {
    switch (networkId) {
        case NetworkId.Iota:
            return 'IOTA'
        case NetworkId.IotaAlphanet:
            return 'IOTA Alphanet'
        case NetworkId.Shimmer:
            return 'Shimmer'
        case NetworkId.ShimmerTestnet:
            return 'Shimmer Testnet'
        default:
            return 'Unknown Network'
    }
}
