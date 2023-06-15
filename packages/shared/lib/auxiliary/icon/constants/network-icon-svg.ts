import { ChainId, NetworkId } from '@core/network'

import { Icon } from '../enums'

export const NETWORK_ICON_SVG: { [key in string]: Icon } = {
    [NetworkId.Iota]: Icon.Iota,
    [NetworkId.Shimmer]: Icon.Shimmer,
    [NetworkId.Testnet]: Icon.Shimmer,
    [ChainId.ShimmerEVM]: Icon.ShimmerEvm,
}
