import { NetworkId } from '@core/network'
import { MarketCoinId } from '../enums'

export function getMarketCoinIdByNetworkId(networkId: NetworkId): MarketCoinId | undefined {
    switch (networkId) {
        case NetworkId.Iota:
        case NetworkId.IotaAlphanet:
            return MarketCoinId.Iota
        case NetworkId.Shimmer:
        case NetworkId.ShimmerTestnet:
            return MarketCoinId.Shimmer
        default:
            return
    }
}
