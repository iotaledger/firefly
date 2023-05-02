import { NetworkId } from '@core/network/enums'
import { DestinationNetwork } from '../enums'

export const DEFAULT_CHAINS: Readonly<{ [key in NetworkId]?: { [key in DestinationNetwork]?: string } }> = {
    [NetworkId.Shimmer]: {
        [DestinationNetwork.Shimmer]: '-',
        // [DestinationNetwork.ShimmerEvm]: 'TO_DO',
    },
    [NetworkId.Testnet]: {
        [DestinationNetwork.Shimmer]: '-',
        [DestinationNetwork.ShimmerEvmTestnet]: 'rms1prwgvvw472spqusqeufvlmp8xdpyxtrnmvt26jnuk6sxdcq2hk8scku26h7',
    },
    [NetworkId.Custom]: {
        [DestinationNetwork.Shimmer]: '-',
    },
}
