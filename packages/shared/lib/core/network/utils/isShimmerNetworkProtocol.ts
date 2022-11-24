import { NetworkProtocol } from '@core/network/enums'

export function isShimmerNetworkProtocol(networkProtocol: NetworkProtocol): boolean {
    return networkProtocol === NetworkProtocol.Shimmer
}
