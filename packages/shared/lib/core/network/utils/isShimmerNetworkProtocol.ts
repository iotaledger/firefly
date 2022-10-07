import { NetworkProtocol } from '@core/network'

export function isShimmerNetworkProtocol(networkProtocol: NetworkProtocol): boolean {
    return networkProtocol === NetworkProtocol.Shimmer
}
